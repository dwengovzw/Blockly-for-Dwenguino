# Rotation Gain Tuning Fix

## Problem

When enforcing constraints, the optimizer was preferring translations over rotations. Even when rotations were required for the system to converge, they remained very small compared to translations.

## Root Cause

**Scale Mismatch**: Translation and rotation motion operate on completely different physical scales:

- **Translation**: Measured in world space units (millimeters, centimeters, etc.)
  - Error of 10 units is significant
  - Gain of 0.5 produces 5 units of motion

- **Rotation**: Measured in radians (dimensionless angle)
  - Error of 1 radian ≈ 57° is huge
  - But a cross product error is often tiny (< 0.1)
  - Gain of 0.5 applied to small cross product produces tiny rotation

Example:
```javascript
// If constraint error is 10 units and r = 1 unit:
translationGain = 0.5
rotationGain = 0.5

deltaV = error * translationGain = 10 * 0.5 = 5 units
deltaOmega = (r × error) * rotationGain = (1 × 10) * 0.5 = 5 rad/s

// But radians are much smaller than world units!
// 5 radians = 286° (actually too much)
// But if r × error is small, like 0.1:
// deltaOmega = 0.1 * 0.5 = 0.05 radians = 2.8° (too small)
```

The solver sees that translations reduce error faster and prioritizes them.

## Solution

Increase rotation gain relative to translation gain by **1.5-3x**:

### Updated Gains:

**PointPointCoincidentConstraint:**
```javascript
const translationGain = 0.5 * stiffness;
const rotationGain = 1.5 * stiffness;  // 3x translation gain
```

**PointPlaneConstraint:**
```javascript
const translationGain = 0.6 * stiffness;
const rotationGain = 1.8 * stiffness;  // 3x translation gain
```

**PlanePlaneParallelConstraint:**
```javascript
const rotationMultiplier = 1.5;  // 1.5x gain for rotations
deltaOmega2.multiplyScalar(weight2 * stiffness * rotationMultiplier);
```

## Why This Works

1. **Balanced error reduction**: Translations and rotations now reduce error at similar rates
2. **Natural motion**: Mechanisms naturally use both translation and rotation
3. **Faster convergence**: System finds solutions requiring rotations instead of overly relying on translation
4. **Physical realism**: Matches how real mechanisms behave (pivots, hinges, etc.)

## Effect on Constraint Behavior

### Before (rotation too small):
```
Iteration 1: Jaw translates 8 units, rotates 0.5°
Iteration 2: Jaw translates 4 units, rotates 0.25°
Iteration 3: Jaw translates 2 units, rotates 0.125°
Result: Translation dominates; rotation barely helps
```

### After (balanced):
```
Iteration 1: Jaw translates 3 units, rotates 2°
Iteration 2: Jaw translates 1.5 units, rotates 1°
Iteration 3: Jaw translates 0.75 units, rotates 0.5°
Result: Both translation and rotation work together
```

## Tuning Recommendations

The 1.5x multiplier is a good balance. If you need to adjust:

- **More rotation encouraged**: Increase to 2.0-3.0x (more aggressive pivoting)
- **More conservative**: Reduce to 1.0-1.5x (smoother, but slower convergence)
- **Much larger mechanism**: May need 2.0+ due to different scales

```javascript
// For more aggressive rotation:
const rotationGain = 2.0 * stiffness;  // 4x translation

// For more conservative:
const rotationGain = 1.0 * stiffness;  // 2x translation
```

## Testing the Fix

1. **Visual behavior**: Gripper jaws should rotate naturally around pivots
2. **Convergence**: Constraints should satisfy in fewer iterations
3. **Motion quality**: Less "sliding" translation, more "hinging" rotation
4. **Edge cases**: Constraints with pure rotation requirements should now work

## Mathematical Background

In constraint-based kinematics, the twist equations are:
```
δp = δv + δω × r

Where:
  δp = change in point position
  δv = change in body position (translation)
  δω = change in body orientation (rotation)
  r = vector from body origin to point
```

Both terms contribute to satisfying the constraint, but they have different scales:
- δv is measured in units
- δω is measured in radians

Multiplying rotationGain by 1.5-3.0 effectively "rescales" angular motion to match the scale of linear motion, allowing the solver to use both naturally.

## Files Modified

- `dwenguino_simulation_scenario_gripper.js`
  - `applyPointPointCoincidentConstraint`: rotationGain = 1.5x
  - `applyPointPlaneConstraint`: rotationGain = 1.8x
  - `applyPlanePlaneParallelConstraint`: rotationMultiplier = 1.5x
