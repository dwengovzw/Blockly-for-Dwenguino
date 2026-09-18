# Per-Entity Weights: Mathematical Foundation

## Overview

The constraint solver uses twist-based incremental rigid-body motion to enforce constraints. Per-entity weights control how the constraint enforcement is distributed among participating entities.

## Twist-Based Constraint Solving

A **twist** is a small incremental rigid-body motion consisting of:
- **Linear velocity**: δv (translation)
- **Angular velocity**: δω (rotation)

The motion of a point p on a body is:
```
δp = δv + δω × r
```
where r is the vector from body origin to the point.

## Constraint Error Distribution

When two points must be coincident but are separated by error vector **e**:

### Without Per-Entity Weights (Symmetric)
Both entities move equally:
```
Entity 0: applies twist with gain = 0.5 * stiffness
Entity 1: applies twist with gain = 0.5 * stiffness
```

Both twists work to reduce error **e**, meeting in the middle.

### With Per-Entity Weights (Asymmetric)
Each entity moves according to its weight:
```
Entity i: applies twist with gain = wi * stiffness
```

Where weights are normalized: ∑wi = 1.0

## Mathematical Formulation

### Point-Point Coincidence Constraint

**Given:**
- Point on entity 0: p₀
- Point on entity 1: p₁  
- Error: e = p₀ - p₁
- Entity weights: w₀, w₁ (normalized: w₀ + w₁ = 1.0)
- Stiffness: s ∈ [0, 1]

**Twists computed:**

For entity 0 (reference):
```
δv₀ = -w₀ * s * e              (translation along error)
δω₀ = -w₀ * s * (r₀ × e)       (rotation to reduce error)
```

For entity 1:
```
δv₁ = w₁ * s * e               (translation opposite to error)
δω₁ = w₁ * s * (r₁ × e)        (rotation to reduce error)
```

Where:
- r₀ = p₀ - origin₀ (vector from entity 0 origin to constraint point)
- r₁ = p₁ - origin₁ (vector from entity 1 origin to constraint point)

**Result:**
- Entity 0 moves by w₀ fraction of error
- Entity 1 moves by w₁ fraction of error
- Total displacement = w₀ * e + w₁ * (-e) = (w₀ - w₁) * e ≈ 0 (constraint satisfied)

### Point-Plane Constraint

**Given:**
- Point p on entity 0
- Plane with normal n on entity 1
- Signed distance d = n · (p - planePoint)
- Entity weights: w₀, w₁

**Twists computed:**

For entity 0 (point):
```
δv₀ = -w₀ * s * d * n          (move point toward plane)
δω₀ = -w₀ * s * d * (r₀ × n)   (rotate to approach plane)
```

For entity 1 (plane):
```
δv₁ = w₁ * s * d * n           (move plane toward point)
δω₁ = w₁ * s * d * (r₁ × n)    (rotate plane to meet point)
```

**Result:**
- Point moves w₀ fraction of distance to plane
- Plane moves w₁ fraction of distance to point

### Plane-Plane Parallel Constraint

**Given:**
- Plane 1 normal: n₁ on entity 0
- Plane 2 normal: n₂ on entity 1
- Normal error: e = n₂ × n₁ (cross product gives rotation axis)
- Entity weights: w₀, w₁

**Twists computed:**

For entity 0:
```
δω₀ = -w₀ * s * (n₂ × n₁)      (rotate n₁ toward n₂)
```

For entity 1:
```
δω₁ = w₁ * s * (n₂ × n₁)       (rotate n₂ toward n₁)
```

With optional coincidence constraint adding translation:
```
δv₀ = ±w₀ * s * distance * n   (move planes closer)
δv₁ = ±w₁ * s * distance * n
```

## Weight Normalization Algorithm

```javascript
// Raw weights from descriptor
const rawWeights = [w₀, w₁, ..., wₙ];

// Compute sum
const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0);

// Normalize
const normalizedWeights = totalWeight > 0 
    ? rawWeights.map(w => w / totalWeight)      // if total > 0
    : rawWeights.map(() => 1.0 / rawWeights.length);  // equal split if total = 0
```

**Examples:**
```
Input:  [1.0, 1.0]      →  Output: [0.5, 0.5]
Input:  [1.0, 0.0]      →  Output: [1.0, 0.0]
Input:  [0.7, 0.3]      →  Output: [0.7, 0.3]
Input:  [2.0, 1.0, 1.0] →  Output: [0.5, 0.25, 0.25]
Input:  [0.0, 0.0]      →  Output: [0.5, 0.5]  (equal split)
```

## Constraint Composition

When multiple constraints act on the same entity:

```
Total displacement = ∑ᵢ(displacement from constraint i)
```

Example: Entity A has three constraints:
- Constraint 1: A at w=0.5, B at w=0.5 → A moves by +0.5*e₁
- Constraint 2: A at w=1.0, C at w=0.0 → A moves by +e₂
- Constraint 3: A at w=0.3, D at w=0.7 → A moves by +0.3*e₃

Total: A moves by (0.5*e₁ + e₂ + 0.3*e₃)

## Convergence Behavior

The constraint solver iterates until convergence:

```javascript
while (iteration < maxIterations && error > convergenceThreshold) {
    for each constraint:
        apply constraint with weight distribution
    iteration++
}
```

Per-entity weights affect how quickly the constraint is satisfied:
- **High weight (w ≈ 1.0)**: Entity moves more per iteration
- **Low weight (w ≈ 0.0)**: Entity moves less per iteration
- **Equal weights (w = 0.5)**: Entity moves at moderate rate

## Mechanical Interpretation

### Fixed Point (1.0, 0.0)
```
Entity A: weight 1.0 (does not move)
Entity B: weight 0.0 (moves to entity A)
Mechanical: Point A is fixed in world; B is pulled to A
```

### Symmetric Hinge (0.5, 0.5)
```
Entity A: weight 0.5 (moves toward middle)
Entity B: weight 0.5 (moves toward middle)
Mechanical: Both entities pivot toward shared center
```

### Master-Slave (0.8, 0.2)
```
Entity A: weight 0.8 (barely moves)
Entity B: weight 0.2 (moves significantly toward A)
Mechanical: B is slave to A; A is master
```

## Stability Analysis

The per-entity weight system maintains stability because:

1. **Bounded displacements**: Each displacement is scaled by weight ≤ 1.0
2. **Error reduction**: Total error decreases each iteration
3. **Normalized weights**: ∑wᵢ = 1.0 prevents over-constraint
4. **Convergence guarantee**: Bounded, monotonically decreasing error → convergence

## Performance Implications

- Per-entity weights add negligible computational cost
- Only a single weight multiplication per constraint application
- No additional constraint iterations required
- Cache-friendly (weights stored inline with constraint)

## Limitations and Design Choices

1. **Linear weight distribution**: Weights distribute displacement linearly by entity
   - Not influenced by mass or inertia
   - Suitable for kinematic constraints (not dynamic)

2. **Normalized to sum=1**: Ensures total displacement equals error
   - Allows flexible interpretation of 1.0 weight
   - Prevents constraint amplification

3. **Per-entity weights only**: No per-dimension weights (e.g., different X/Y/Z)
   - Simpler API
   - Sufficient for most gripper mechanisms

4. **Applied per constraint**: Weights don't carry between constraints
   - Independent constraint specifications
   - Allows per-constraint tuning

## Example: Gripper Mechanism

Typical gripper with asymmetric constraints:

```
Constraint 1: Left jaw pivot fixed to base
  Entities: [base (w=1.0), left_jaw (w=0.0)]
  Behavior: Left jaw stays at fixed position
  
Constraint 2: Right jaw pivot fixed to base  
  Entities: [base (w=1.0), right_jaw (w=0.0)]
  Behavior: Right jaw stays at fixed position

Constraint 3: Grip faces parallel
  Entities: [left_jaw (w=0.5), right_jaw (w=0.5)]
  Behavior: Both jaws rotate equally to keep faces parallel
```

Result:
- Both jaws pivot about fixed base points
- Grip faces maintain parallel orientation
- Natural symmetric gripper motion

## References

- Twist-based rigid body motion: Murray, Sastry, Zexiang (Robot Manipulation)
- Constraint-based kinematics: Garcia de Jalón, Bayo (Kinematic and Dynamic Simulation)
- Iterative constraint solving: Baraff, Witkin, Kass (Physically Based Modeling)
