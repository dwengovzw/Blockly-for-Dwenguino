# Per-Entity Weights Implementation

## Overview

Implemented per-entity weight support in the constraint solver to control asymmetric displacement distribution. This allows each entity in a constraint to move different amounts in response to the constraint, enabling natural mechanical behavior like one part staying fixed while another moves.

## Changes Made

### 1. Constraint Descriptor Format

Updated the constraint entity format to support per-entity weights:

```json
{
  "id": "example_constraint",
  "type": "PointPointCoincident",
  "entities": [
    { "name": "part-1", "referencePoint": "pivot", "weight": 0.5 },
    { "name": "part-2", "referencePoint": "pivot", "weight": 0.5 }
  ],
  "weight": 1.0
}
```

**Entity weight meanings:**
- `1.0` = full enforcement on this part (other parts are fixed)
- `0.0` = no enforcement on this part (other parts move to satisfy constraint)
- `0.5` = symmetric split of enforcement (both parts move equally)
- Weights are automatically normalized so their sum equals 1.0

### 2. Code Changes

#### Entity Normalization (lines ~928-960)
Added extraction of per-entity weight field:
```javascript
entityWeight: typeof entry.weight === 'number' ? entry.weight : 1.0
```

#### Constraint Storage (lines ~1015-1025)
Added normalized entity weights to constraint object:
```javascript
// Extract and normalize per-entity weights
const entityWeights = normalizedEntities.map(e => e.entityWeight ?? 1.0);
const totalWeight = entityWeights.reduce((sum, w) => sum + w, 0);
const normalizedEntityWeights = totalWeight > 0 
    ? entityWeights.map(w => w / totalWeight)
    : entityWeights.map(() => 1.0 / entityWeights.length);

this.constraints.push({
    // ... other fields ...
    entityWeights: normalizedEntityWeights,  // Per-entity weights normalized to sum=1.0
});
```

#### Constraint Application Methods Updated

**applyPointPointCoincidentConstraint** (lines ~1367-1500):
- Extract per-entity weights from constraint
- Split error correction between reference entity and moving entity
- Apply movement proportional to entity weights
- Reference entity (entity 0) now moves by `weight0` fraction
- Each other entity (entity i) moves by `weightI` fraction

**applyPointPlaneConstraint** (lines ~1513-1620):
- Extract per-entity weights
- Apply correction to both point and plane entities
- Point entity moves by `weight0` fraction
- Plane entity moves opposite by `weight1` fraction

**applyPlanePlaneParallelConstraint** (lines ~1632-1795):
- Extract and apply per-entity weights for each plane pair
- Entity 0 (reference plane) rotates by `weight0` fraction
- Entity i (moving plane) rotates by `weightI` fraction
- Both translation and rotation respect entity weights

### 3. Example Descriptor Updates

Updated `joint_descriptor2.json` with per-entity weight examples:

**Symmetric constraints (50/50 split):**
```json
{
  "id": "hinge1_pivot",
  "entities": [
    { "name": "arm-1", "referencePoint": "pivot_right", "weight": 0.5 },
    { "name": "arm-2", "referencePoint": "pivot_right", "weight": 0.5 }
  ]
}
```

**Asymmetric constraints (70/30 split):**
```json
{
  "id": "lever1_pivot_right",
  "entities": [
    { "name": "arm-2", "referencePoint": "pivot_left_back", "weight": 0.7 },
    { "name": "lever-1", "referencePoint": "pivot_center", "weight": 0.3 }
  ]
}
```

**Fixed constraint (100/0 split):**
```json
{
  "id": "lever1_pivot_right_fixed",
  "entities": [
    { "name": "lever-1", "referencePoint": "pivot_right", "weight": 1.0 }
  ]
}
```

## Behavior Examples

### Scenario 1: Symmetric Hinge (50/50 weights)
```
Initial: Part A at x=0, Part B at x=10
Constraint: Points coincide with weight A=0.5, weight B=0.5
Result: Part A moves to x=5, Part B moves to x=5
```

### Scenario 2: Driven Linkage (70/30 weights)
```
Initial: Arm at x=0, Lever at x=10
Constraint: Points coincide with weight Arm=0.7, weight Lever=0.3
Result: Arm moves to x=7, Lever moves to x=7 (arm moves more)
```

### Scenario 3: Fixed Point (100/0 weights)
```
Initial: Fixed part at x=0, Moving part at x=10
Constraint: Points coincide with weight Fixed=1.0, weight Moving=0.0
Result: Fixed part stays at x=0, Moving part moves to x=0
```

## Technical Details

### Weight Normalization
- Raw weights from descriptor: `[w0, w1, ..., wn]`
- Sum of weights: `totalWeight = sum(wi)`
- Normalized weights: `normalized_wi = wi / totalWeight`
- Ensures sum of normalized weights always equals 1.0

### Constraint Error Distribution
For PointPointCoincident constraint with error vector `e`:
- Reference entity (entity 0) applies twist with gain: `weight0 * gain`
- Moving entity (entity i) applies twist with gain: `weighti * gain`
- Total displacement = error (constraint satisfied)
- Distribution of displacement = weighted distribution

### Twist Computation
For each entity with weight `wi`:
- Translation: `Δv_i = wi * gain * errorComponent`
- Rotation: `Δω_i = wi * gain * (r × errorComponent)`

## Backward Compatibility

- If no `weight` field on entity: defaults to `1.0`
- If no `entityWeights` on constraint: defaults to equal distribution
- Old constraint definitions without entity weights work as before

## Files Modified

1. **dwenguino_simulation_scenario_gripper.js**
   - Updated entity normalization (add entityWeight extraction)
   - Updated constraint storage (add entityWeights field)
   - Updated applyPointPointCoincidentConstraint (implement per-entity weights)
   - Updated applyPointPlaneConstraint (implement per-entity weights)
   - Updated applyPlanePlaneParallelConstraint (implement per-entity weights)
   - Updated documentation comments with per-entity weight examples

2. **joint_descriptor2.json**
   - Added `weight` field to all entities in constraints
   - Demonstrated symmetric (0.5/0.5), asymmetric (0.7/0.3), and fixed (1.0/0.0) weight distributions

## Usage

To use per-entity weights in your descriptor:

```json
{
  "type": "PointPointCoincident",
  "entities": [
    { 
      "name": "stationary_part", 
      "referencePoint": "pivot",
      "weight": 1.0  // This part doesn't move
    },
    { 
      "name": "movable_part", 
      "referencePoint": "pivot",
      "weight": 0.0  // This part moves to satisfy constraint
    }
  ]
}
```

Or for symmetric distribution:

```json
{
  "type": "PointPointCoincident",
  "entities": [
    { "name": "part_a", "referencePoint": "point", "weight": 0.5 },
    { "name": "part_b", "referencePoint": "point", "weight": 0.5 }
  ]
}
```
