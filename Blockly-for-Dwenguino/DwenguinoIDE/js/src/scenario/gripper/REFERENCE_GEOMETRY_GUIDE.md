# Reference Geometry and Arbitrary Rotation Axes Guide

## Overview

The kinematics descriptor now supports two key features that solve the original problems:

1. **Reference Points/Planes** - Define measurement geometry per part (no SolidWorks export required)
2. **Arbitrary Rotation Axes** - Joints can rotate around any point, not just the part origin

## Problem 1: No Reference Geometry Export from SolidWorks

**Original Issue:** SolidWorks datum planes and points cannot be exported to GLB files, so constraints had no reference geometry to work with.

**Solution:** Define reference points and planes directly in the descriptor as part of each part's metadata.

### Reference Points (LOCAL coordinates)

Reference points are defined in LOCAL coordinates relative to each part's origin:

```json
{
  "parts": [
    {
      "name": "jaw_left",
      "referencePoints": {
        "pivot": { "x": -30, "y": 20, "z": 0 },
        "gripSurface": { "x": -55, "y": 20, "z": 0 }
      },
      "referencePlanes": {
        "gripFace": {
          "normal": [0, 1, 0],
          "point": [-55, 20, 0]
        }
      }
    }
  ]
}
```

**Key points:**
- Coordinates are IN LOCAL SPACE (relative to the part's coordinate frame)
- When the part moves/rotates, reference points follow automatically
- Reference point cache is invalidated when parts move
- Zero overhead - just lookup and transform by part's matrixWorld

### How Reference Points are Used

When a constraint references a point:

```json
{
  "id": "parallel_grips",
  "type": "Parallel",
  "entities": ["jaw_left", "jaw_right"],
  "referencePoints": ["gripFace", "gripFace"],
  "weight": 1.0
}
```

The solver:
1. Gets world position of `jaw_left.gripFace` using `getReferencePointWorldPosition()`
2. Gets world position of `jaw_right.gripFace`
3. Measures orientations at these locations
4. Applies rotation to the actual part nodes (jaw_left, jaw_right)
5. Reference points follow parts automatically

## Problem 2: Joints Always Rotate Around Origin

**Original Issue:** Joints defined only by axis `[x, y, z]`, always rotated around part's local origin. In complex assemblies, many parts rotate around arbitrary points (e.g., a gripper finger rotates around its pivot point, not its center).

**Solution:** Add `axisPoint` field to joints to specify where rotation axis passes through.

### Specifying Rotation Axis Points

Two ways to define where a joint rotates:

**Option 1: Reference a named point**
```json
{
  "name": "jaw_left_joint",
  "node": "jaw_left",
  "axis": [0, 0, -1],
  "axisPoint": "pivot",
  "minDeg": 0,
  "maxDeg": 90,
  "servo": { "index": 1 }
}
```

The "pivot" point must be defined in the part's referencePoints:
```json
"jaw_left": {
  "referencePoints": {
    "pivot": { "x": -30, "y": 20, "z": 0 }
  }
}
```

**Option 2: Explicit local coordinates**
```json
{
  "name": "jaw_left_joint",
  "node": "jaw_left",
  "axis": [0, 0, -1],
  "axisPoint": { "x": -30, "y": 20, "z": 0 },
  "minDeg": 0,
  "maxDeg": 90
}
```

### How Arbitrary Rotation Axes Work

In `applyServoState()`:

1. Calculate servo angle and rotation quaternion normally
2. Get axisPoint location (from reference point or explicit coords)
3. **Instead of rotating around part's origin:**
   - Translate part so rotation axis is at origin
   - Apply rotation
   - Translate back
4. Result: Part rotates around arbitrary point while maintaining shape

**Mathematical form:**
```
newWorldPos = axisPoint + rotationQuat * (oldWorldPos - axisPoint)
```

## Complete Example

### GLB File Structure
```
gripper_assembly
├── base (box)
├── jaw_left (group)
│   └── jaw_left_mesh
└── jaw_right (group)
    └── jaw_right_mesh
```

### Descriptor with Reference Points and Arbitrary Axes

```json
{
  "version": 1,
  "model": { "upAxis": "Y", "scale": 1 },
  
  "parts": [
    {
      "name": "jaw_left",
      "referencePoints": {
        "pivot": { "x": -30, "y": 20, "z": 0 },
        "gripSurface": { "x": -55, "y": 20, "z": 0 }
      },
      "referencePlanes": {
        "gripFace": {
          "normal": [0, 1, 0],
          "point": [-55, 20, 0]
        }
      }
    },
    {
      "name": "jaw_right",
      "referencePoints": {
        "pivot": { "x": 30, "y": 20, "z": 0 },
        "gripSurface": { "x": 55, "y": 20, "z": 0 }
      },
      "referencePlanes": {
        "gripFace": {
          "normal": [0, -1, 0],
          "point": [55, 20, 0]
        }
      }
    }
  ],
  
  "joints": [
    {
      "name": "jaw_left",
      "node": "jaw_left",
      "axis": [0, 0, -1],
      "axisPoint": "pivot",
      "minDeg": 0,
      "maxDeg": 90,
      "servo": { "index": 1, "min": 180, "max": 90 }
    },
    {
      "name": "jaw_right",
      "node": "jaw_right",
      "axis": [0, 0, 1],
      "axisPoint": "pivot",
      "minDeg": 0,
      "maxDeg": 90,
      "servo": { "index": 2, "min": 0, "max": 90 }
    }
  ],
  
  "constraints": [
    {
      "id": "parallel_grips",
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "referencePoints": ["gripFace", "gripFace"],
      "weight": 1.0
    },
    {
      "id": "concentric_pivots",
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"],
      "referencePoints": ["pivot", "pivot"],
      "weight": 0.9
    }
  ],
  
  "constraintSolver": {
    "maxIterations": 15,
    "convergenceThreshold": 0.0005,
    "enableConflictDetection": true
  }
}
```

## API Reference

### New Helper Methods

#### `getReferencePointWorldPosition(partName, pointName)`
Get world-space position of a reference point.
- **Returns:** `THREE.Vector3` in world coordinates
- **Caching:** Results are cached and invalidated when parts move

#### `getReferencePlaneWorld(partName, planeName)`
Get world-space plane (normal + point) of a reference plane.
- **Returns:** `{normal: Vector3, point: Vector3}` in world coordinates

#### `getPartDefinition(partName)`
Get part metadata from descriptor.
- **Returns:** Part definition object or null

#### `getMeasurementNodeForConstraint(constraint, entityIndex)`
Get measurement point for a constraint entity (reference point or datum).
- **Returns:** `THREE.Vector3` or `THREE.Object3D` node
- **Priority:** referencePoints > datums > entity node

#### `invalidateReferencePointCache(partName)`
Clear cached reference point positions after parts move.
- Called automatically during constraint solving

### Modified Methods

#### `applyKinematicsDescriptor()`
Now builds `partsCache` from descriptor's `parts` array.

#### `applyServoState(boardState)`
Now supports:
- `axisPoint` field (string reference or explicit coords)
- Rotation around arbitrary points
- Automatic cache invalidation

#### `initializeConstraints()`
Now supports:
- `referencePoints` array in constraints
- Resolves reference points to world coordinates
- Falls back to datums for backward compatibility

## Migration from Datums to Reference Points

### Before (SolidWorks Datums)
```json
{
  "constraints": [
    {
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "datums": ["jaw_left_datum_node", "jaw_right_datum_node"]
    }
  ]
}
```
❌ Requires datum nodes in GLB file (not supported by SolidWorks export)

### After (Reference Points)
```json
{
  "parts": [
    {
      "name": "jaw_left",
      "referencePoints": {
        "gripSurface": { "x": -55, "y": 20, "z": 0 }
      }
    }
  ],
  "constraints": [
    {
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "referencePoints": ["gripSurface", "gripSurface"]
    }
  ]
}
```
✅ No SolidWorks export needed, just define points in descriptor

## Architecture

### Part Name Mapping
```
GLB File (scene graph nodes)
    ↓
Descriptor parts[].name (must match GLB node names)
    ↓
Reference points are LOCAL coords relative to part node
    ↓
During solving: local coords → world coords (using part's matrixWorld)
    ↓
Constraints measure at world positions, apply transforms to parts
```

### Data Structures

**Joint binding with arbitrary axis support:**
```javascript
{
  descriptor: jointDef,
  node: THREE.Object3D,
  baseQuaternion: quaternion,
  basePosition: Vector3
}
```

**Constraint with reference point support:**
```javascript
{
  id: string,
  type: string,
  entities: [{ name, node }],
  referencePoints: [{ name, entityName }],  // NEW
  datums: [{ name, node }],                 // Legacy
  weight: number,
  definition: object,
  fixedTargets: array
}
```

## Performance Considerations

- **Reference point lookups:** O(1) cached, O(1) matrix transform
- **Cache invalidation:** Only when parts move (during constraint solving)
- **Memory:** Parts cache (1 map), reference points cache (1 map per part)
- **Arbitrary rotation:** Extra matrix operations (~10 extra floats per joint per frame)

## See Also

- `example_descriptor_with_reference_points.json` - Complete working example
- Constraint types: Horizontal, Vertical, Collinear, Perpendicular, Parallel, Tangent, Concentric, Coincident, Equal, Fixed
