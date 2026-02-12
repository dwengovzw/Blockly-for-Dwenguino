# Iterative Constraint Solver Guide

## Overview

The gripper simulation now includes an **iterative constraint solver** with **constraint weights** and **automatic conflict detection**. This transforms the simple direct enforcement approach into a robust system that can handle complex constraint networks and resolve conflicts gracefully.

## What's New

### 1. Iterative Solver
Instead of applying constraints once per frame, the solver iterates multiple times until:
- All constraints converge to a stable solution
- Maximum iteration limit is reached
- Change between iterations falls below convergence threshold

### 2. Constraint Weights (Soft Constraints)
Each constraint can have a weight from 0.0 to 1.0:
- **1.0** = Hard constraint (100% enforcement)
- **0.5** = Soft constraint (50% enforcement)
- **0.0** = Disabled constraint (no enforcement)

Constraints are applied in priority order (highest weight first).

### 3. Automatic Conflict Detection
The system detects and warns about:
- Contradictory constraints (parallel + perpendicular)
- Over-constrained entities (>3 constraints per part)
- Redundant constraints
- Geometrically impossible configurations

---

## Configuration

### Solver Settings

Add a `constraintSolver` section to your kinematics descriptor:

```json
{
  "constraintSolver": {
    "maxIterations": 10,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true
  }
}
```

> **💡 Working with SolidWorks Models:** For precise constraints on edges, faces, or specific points from SolidWorks assemblies, use **datum planes/points/axes** instead of full part nodes. Datum elements export as separate named nodes in your GLB file, allowing sub-element precision. See **[SOLIDWORKS_DATUM_TUTORIAL.md](./SOLIDWORKS_DATUM_TUTORIAL.md)** for a complete guide on creating, naming, and exporting datum reference geometry.

**Parameters:**

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `maxIterations` | number | 1-20 | 10 | Maximum solver iterations per frame |
| `convergenceThreshold` | number | 0.0001-0.01 | 0.001 | Convergence threshold (radians/units) |
| `enableConflictDetection` | boolean | true/false | true | Enable automatic conflict warnings |

**Performance Guidelines:**
- `maxIterations: 5` - Fast (simple constraints)
- `maxIterations: 10` - Balanced (default, most cases)
- `maxIterations: 20` - Accurate (complex constraint networks)

Lower `convergenceThreshold` = more precise but may require more iterations.

---

## Constraint Weights

### Adding Weights to Constraints

```json
{
  "constraints": [
    {
      "id": "critical_alignment",
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "weight": 1.0,
      "description": "Hard constraint - must be satisfied"
    },
    {
      "id": "preferred_position",
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"],
      "weight": 0.5,
      "description": "Soft constraint - preferred but not required"
    },
    {
      "id": "aesthetic_alignment",
      "type": "Horizontal",
      "entities": ["base"],
      "weight": 0.3,
      "description": "Weak constraint - aesthetic only"
    }
  ]
}
```

### Weight Guidelines

| Weight | Strength | Use Case | Example |
|--------|----------|----------|---------|
| 1.0 | Hard | Critical mechanical constraints | Parallel gripper jaws |
| 0.8-0.9 | Strong | Important functional constraints | Concentric pivot points |
| 0.5-0.7 | Medium | Preferred but flexible | Alignment guides |
| 0.2-0.4 | Weak | Aesthetic or optional | Visual alignment |
| 0.1 | Very weak | Suggestions only | Default orientations |

**Important:** If `weight` is omitted, defaults to `1.0` (hard constraint).

---

## Conflict Detection

### Detected Conflicts

The system automatically detects these conflict types:

#### 1. Contradictory Orientation Constraints
- **Parallel + Perpendicular** on same entities
- **Horizontal + Vertical** on same entity
- **Collinear + Perpendicular** on same entities

**Warning Example:**
```
[Gripper Constraints] Detected 1 potential conflicts:
  - Constraints 'align_horizontal' (Horizontal) and 'align_vertical' (Vertical) 
    conflict on entities: jaw_left - Cannot be both horizontal and vertical
```

#### 2. Over-Constrained Entities
Entities with more than 3 constraints may become unstable.

**Warning Example:**
```
  - Entity 'jaw_left' is over-constrained with 5 constraints (may cause instability)
```

#### 3. Redundant Constraints
Multiple constraints achieving the same goal.

**Warning Example:**
```
  - Constraints 'center1' (Coincident) and 'center2' (Concentric) 
    conflict on entities: jaw_left, jaw_right - Redundant positional constraints
```

### Viewing Conflict Warnings

Check the browser console (F12 → Console) after loading a descriptor:

```
[Gripper Constraints] Initialized 8 constraints with iterative solver (max 10 iterations)
[Gripper Constraints] Detected 2 potential conflicts:
  - Constraints 'parallel_jaws' (Parallel) and 'perpendicular_jaws' (Perpendicular) 
    conflict on entities: jaw_left, jaw_right - Cannot be both parallel and perpendicular
  - Entity 'jaw_left' is over-constrained with 4 constraints (may cause instability)
```

---

## How the Solver Works

### Execution Flow

```
1. User code updates servo angles
   ↓
2. applyServoState() - Apply servo rotations to joints
   ↓
3. applyConstraints() - Iterative solver begins
   ├─ Sort constraints by weight (highest first)
   ├─ For iteration 1 to maxIterations:
   │  ├─ Apply all constraints in priority order
   │  ├─ Compute state change from previous iteration
   │  └─ If change < convergenceThreshold → CONVERGED, exit
   └─ If not converged → Log warning
   ↓
4. renderScene() - Display result
```

### Convergence Behavior

**Converged (Good):**
```
[Gripper Constraints] Converged in 3 iterations (delta: 0.000234)
```
The solver found a stable solution quickly.

**Did Not Converge (Warning):**
```
[Gripper Constraints] Did not converge after 10 iterations (may have conflicting constraints)
```
Possible causes:
- Conflicting constraints
- Over-constrained system
- `maxIterations` too low
- Geometrically impossible configuration

---

## Examples

### Example 1: Parallel Gripper with Priorities

```json
{
  "constraintSolver": {
    "maxIterations": 10,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true
  },
  "constraints": [
    {
      "id": "parallel_jaws",
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "weight": 1.0,
      "description": "Jaws must stay parallel (critical)"
    },
    {
      "id": "symmetric_position",
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"],
      "weight": 0.8,
      "description": "Prefer symmetric positions"
    },
    {
      "id": "horizontal_base",
      "type": "Horizontal",
      "entities": ["base"],
      "weight": 0.5,
      "description": "Base should be horizontal (aesthetic)"
    }
  ]
}
```

**Result:** Parallel constraint is enforced first (weight 1.0), then concentric (0.8), then horizontal (0.5). If conflicts arise, lower-weight constraints yield to higher-weight ones.

### Example 2: Complex Mechanism with Soft Constraints

```json
{
  "constraintSolver": {
    "maxIterations": 15,
    "convergenceThreshold": 0.0005,
    "enableConflictDetection": true
  },
  "constraints": [
    {
      "id": "link1_vertical",
      "type": "Vertical",
      "entities": ["link1"],
      "weight": 1.0,
      "description": "Link 1 must be vertical"
    },
    {
      "id": "link2_perpendicular",
      "type": "Perpendicular",
      "entities": ["link1", "link2"],
      "weight": 1.0,
      "description": "Link 2 perpendicular to link 1"
    },
    {
      "id": "gripper_parallel",
      "type": "Parallel",
      "entities": ["gripper_left", "gripper_right"],
      "weight": 0.9,
      "description": "Grippers should be parallel"
    },
    {
      "id": "aesthetic_alignment",
      "type": "Horizontal",
      "entities": ["link2"],
      "weight": 0.3,
      "description": "Link 2 horizontal if possible"
    }
  ]
}
```

**Result:** Hard constraints (1.0) are satisfied first. The aesthetic horizontal constraint (0.3) will be applied partially if it doesn't conflict with higher-priority constraints.

### Example 3: Handling Conflicts

**Bad Configuration (Conflicting):**
```json
{
  "constraints": [
    {
      "id": "horizontal",
      "type": "Horizontal",
      "entities": ["link"],
      "weight": 1.0
    },
    {
      "id": "vertical",
      "type": "Vertical",
      "entities": ["link"],
      "weight": 1.0
    }
  ]
}
```

**Console Warning:**
```
[Gripper Constraints] Detected 1 potential conflicts:
  - Constraints 'horizontal' (Horizontal) and 'vertical' (Vertical) 
    conflict on entities: link - Cannot be both horizontal and vertical
```

**Fixed Configuration (Using Weights):**
```json
{
  "constraints": [
    {
      "id": "horizontal",
      "type": "Horizontal",
      "entities": ["link"],
      "weight": 1.0,
      "description": "Priority: horizontal"
    },
    {
      "id": "vertical",
      "type": "Vertical",
      "entities": ["link"],
      "weight": 0.0,
      "description": "Disabled due to conflict"
    }
  ]
}
```

---

## Debugging

### Console Commands

Open browser console (F12) and use these commands:

```javascript
// View current constraints
scenario.constraints

// View constraint conflicts
scenario.constraintConflicts

// View solver configuration
scenario.maxConstraintIterations
scenario.convergenceThreshold
scenario.enableConflictDetection

// Temporarily disable a constraint (set weight to 0)
scenario.constraints[0].weight = 0;

// Increase max iterations
scenario.maxConstraintIterations = 20;

// Decrease convergence threshold (more precise)
scenario.convergenceThreshold = 0.0001;
```

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Jittering/vibration | Parts oscillate | Conflicting constraints or too-tight convergence threshold |
| Did not converge | Warning in console | Increase `maxIterations` or relax `convergenceThreshold` |
| Slow performance | Lag during motion | Reduce `maxIterations` or number of constraints |
| Constraint ignored | Not being applied | Check weight > 0 and entities exist in model |
| Parts collapse | Visual artifacts | Over-constrained system, reduce constraint count |

---

## Best Practices

### 1. Constraint Design
- ✅ Use **hard constraints** (1.0) for critical mechanical relationships
- ✅ Use **soft constraints** (0.3-0.7) for preferences and aesthetics
- ✅ Limit to **3 constraints per entity** to avoid over-constraining
- ❌ Don't create contradictory hard constraints

### 2. Performance
- ✅ Start with `maxIterations: 10`, increase if needed
- ✅ Use `convergenceThreshold: 0.001` for most cases
- ✅ Keep total constraint count < 10 for real-time performance
- ❌ Don't set `maxIterations > 20` unless absolutely necessary

### 3. Debugging
- ✅ Enable `enableConflictDetection: true` during development
- ✅ Check console for convergence messages
- ✅ Test constraints incrementally (add one at a time)
- ❌ Don't ignore "did not converge" warnings

### 4. Weight Assignment
- ✅ Use distinct weight values for clear priorities (1.0, 0.8, 0.5, 0.3)
- ✅ Start with all constraints at 1.0, then lower non-critical ones
- ❌ Don't use very similar weights (0.81, 0.82, 0.83) - no clear priority

---

## Technical Details

### Convergence Algorithm

The solver uses position/rotation delta between iterations:

```javascript
delta = max(
  distance(position_current, position_previous),
  angle(quaternion_current, quaternion_previous)
)

if (delta < convergenceThreshold) {
  // CONVERGED
  return;
}
```

### Weight Application

For rotation constraints (Parallel, Perpendicular, etc.):
```javascript
targetRotation = computeConstraintRotation();
weightedRotation = slerp(identityQuaternion, targetRotation, weight);
entity.quaternion.multiply(weightedRotation);
```

For position constraints (Concentric, Coincident):
```javascript
targetOffset = computeConstraintOffset();
weightedOffset = targetOffset * weight;
entity.position.add(weightedOffset);
```

### Conflict Detection Rules

| Constraint Pair | Detected As Conflict | Reason |
|-----------------|---------------------|---------|
| Parallel + Perpendicular | ✅ Yes | Geometrically impossible (0° and 90°) |
| Horizontal + Vertical | ✅ Yes | Mutually exclusive orientations |
| Collinear + Perpendicular | ✅ Yes | Collinear entities cannot be perpendicular |
| Coincident + Concentric | ⚠️ Redundant | Both align positions |
| Multiple Parallel | ✅ Over-constrained | If >3 constraints on one entity |

---

## Migration Guide

### From Old System (Direct Enforcement)

**Old descriptor (still works):**
```json
{
  "constraints": [
    {"type": "Parallel", "entities": ["jaw_left", "jaw_right"]}
  ]
}
```

**New descriptor (with solver features):**
```json
{
  "constraintSolver": {
    "maxIterations": 10,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true
  },
  "constraints": [
    {
      "type": "Parallel", 
      "entities": ["jaw_left", "jaw_right"],
      "weight": 1.0
    }
  ]
}
```

**Backward Compatibility:**
- Old descriptors work without modification
- Default weight is 1.0 (hard constraint)
- Default solver settings apply if `constraintSolver` omitted

---

## API Reference

### Solver Configuration Object

```typescript
{
  maxIterations: number;          // 1-20, default: 10
  convergenceThreshold: number;   // 0.0001-0.01, default: 0.001
  enableConflictDetection: boolean; // default: true
}
```

### Constraint Object (Extended)

```typescript
{
  id: string;                     // Unique identifier
  type: string;                   // Constraint type (Parallel, etc.)
  entities: string[];             // Array of entity names
  weight?: number;                // 0.0-1.0, default: 1.0
  description?: string;           // Human-readable description
}
```

### Runtime Properties

```typescript
class DwenguinoSimulationScenarioGripper {
  maxConstraintIterations: number;
  convergenceThreshold: number;
  enableConflictDetection: boolean;
  constraints: Array<ResolvedConstraint>;
  constraintConflicts: string[];
}
```

---

## FAQ

**Q: What happens if constraints conflict?**
A: Higher-weight constraints are applied first. Lower-weight constraints will be applied partially or not at all to avoid breaking higher-priority constraints.

**Q: Can I disable conflict detection?**
A: Yes, set `"enableConflictDetection": false` in `constraintSolver`. Useful for production if you've already validated constraints.

**Q: Why is my constraint not applied?**
A: Check: (1) Entity names match GLB nodes exactly, (2) Weight > 0, (3) No conflicting higher-priority constraints.

**Q: How many iterations should I use?**
A: Start with 10. If you see "did not converge" warnings, increase to 15-20. If performance is slow, decrease to 5-8.

**Q: What's a good convergence threshold?**
A: 0.001 works for most cases. Use 0.0001 for very precise mechanisms. Use 0.01 for faster but less accurate solving.

**Q: Can I change solver settings at runtime?**
A: Yes, via console:
```javascript
scenario.maxConstraintIterations = 15;
scenario.convergenceThreshold = 0.0005;
```

---

## Conclusion

The iterative constraint solver provides:
- ✅ **Robust conflict handling** via weights and priorities
- ✅ **Automatic convergence** to stable solutions
- ✅ **Conflict detection** to identify problems early
- ✅ **Soft constraints** for flexible design
- ✅ **Backward compatibility** with existing descriptors

This enables complex constraint networks that were impossible with the previous direct enforcement approach!
