# Implementation Summary: Reference Geometry and Arbitrary Rotation Axes

## Problems Solved

### Problem 1: No Reference Geometry Export from SolidWorks
- **Issue:** SolidWorks datum planes/points cannot be exported to GLB files
- **Solution:** Define reference points and planes directly in the descriptor as part metadata (local coordinates)
- **Benefit:** No SolidWorks export hassle, fully descriptor-based geometry

### Problem 2: Joints Always Rotate Around Part Origin
- **Issue:** Complex assemblies need joints to rotate around arbitrary points (e.g., gripper pivots)
- **Solution:** Add `axisPoint` field to joint definitions (can reference named points or explicit coords)
- **Benefit:** Supports realistic multi-part kinematics without custom code

## Architecture Changes

### 1. Descriptor Structure Updates

**DEFAULT_KINEMATICS_DESCRIPTOR** now includes:
- `parts[]` array with per-part reference geometry
- Each part has `referencePoints` (named points in local coords) and `referencePlanes`
- Each joint has `axisPoint` field (string reference or explicit coords)

### 2. New Class Fields

```javascript
partsCache = new Map();              // Part definitions indexed by name
referencePointsCache = new Map();    // Cached world coords: "partName:pointName"
```

### 3. New Methods Added

#### Reference Point Resolution
- `getPartDefinition(partName)` - Get part metadata
- `getReferencePointWorldPosition(partName, pointName)` - Get world-space position
- `getReferencePlaneWorld(partName, planeName)` - Get world-space plane
- `getMeasurementNodeForConstraint(constraint, idx)` - Get measurement point (reference point or datum)
- `invalidateReferencePointCache(partName)` - Invalidate cached positions after moves

### 4. Modified Methods

#### `applyKinematicsDescriptor()`
- Builds `partsCache` from descriptor's `parts` array
- Clears reference points cache
- Stores base position in joint bindings

#### `applyServoState(boardState)`
- Resolves `axisPoint` from joint descriptor
- Supports string references ("pivot") or explicit coords
- Implements rotation around arbitrary points (not just part origin)
- Invalidates reference point cache after moving joints

#### `initializeConstraints()`
- Parses `referencePoints` array from constraints (new)
- Keeps `datums` support for backward compatibility
- Validates reference point count matches entity count

### 5. Updated setupControlPanel Documentation

Comprehensive guide explaining:
- Reference geometry format (local coordinates)
- Joint axisPoint specification
- Constraint with referencePoints
- Migration path from datums
- Concrete examples with syntax

## Data Flow

### Reference Points Workflow
```
1. User defines part in descriptor:
   "jaw_left": { "referencePoints": { "pivot": { x, y, z } } }

2. During kinematic setup:
   - Part definition cached in partsCache
   - Reference points stored as LOCAL coordinates

3. During constraint solving:
   - Constraint asks for "jaw_left.pivot" world position
   - getReferencePointWorldPosition() applies part's matrixWorld
   - Result cached for reuse

4. When part moves (servo applied):
   - Reference point cache invalidated
   - Next access recalculates world position
   - Constraint uses new world position
```

### Joint Rotation Workflow
```
1. User defines joint with axisPoint:
   "joints": [{
     "node": "jaw_left",
     "axis": [0, 0, -1],
     "axisPoint": "pivot"
   }]

2. During servo application:
   - Resolve axisPoint ("pivot" → world position)
   - Calculate rotation quaternion from angle/axis
   
3. Apply rotation:
   - If axisPoint specified: rotate around that point
   - Formula: newPos = axisPoint + quat * (oldPos - axisPoint)
   - If no axisPoint: traditional rotation around part origin
   
4. Result: Part rotates realistically around pivot
```

## Code Changes Summary

### File: dwenguino_simulation_scenario_gripper.js

**Lines 1-90:** Updated DEFAULT_KINEMATICS_DESCRIPTOR
- Added `parts` array with reference geometry
- Added `axisPoint` to joints
- Removed old axis-only definitions

**Lines 100-105:** Added class fields
- `partsCache` and `referencePointsCache` maps

**Lines 612-739:** New reference geometry methods
- `getPartDefinition()` - 5 lines
- `getReferencePointWorldPosition()` - 35 lines with caching
- `getReferencePlaneWorld()` - 25 lines
- `invalidateReferencePointCache()` - 10 lines

**Lines 651-731:** Updated `applyKinematicsDescriptor()`
- Builds parts cache
- Stores base position in joints
- Clears reference point cache

**Lines 826-891:** Updated `initializeConstraints()`
- Added `referencePoints` resolution (15 new lines)
- Kept `datums` support for backward compatibility

**Lines 1137-1165:** New `getMeasurementNodeForConstraint()`
- Priority: referencePoints > datums > entity node
- Handles both string references and explicit coords

**Lines 1448-1534:** Updated `applyServoState()`
- Resolves axisPoint (reference or explicit)
- Rotates around arbitrary points if specified
- Invalidates reference cache after rotation

**Lines 286-333:** Updated setupControlPanel documentation
- 50-line comprehensive guide on reference points
- Joint axisPoint specification
- Constraint referencePoints format
- Migration from datums
- Concrete examples

### New Files

**example_descriptor_with_reference_points.json**
- Complete working example with:
  - 3 parts (jaw_left, jaw_right, base)
  - Reference points and planes per part
  - Joints with axisPoint references
  - Multiple constraint types using referencePoints
  - Configuration examples

**REFERENCE_GEOMETRY_GUIDE.md**
- Complete architectural guide
- Problem/solution explanations
- API reference for all new methods
- Data structure documentation
- Performance considerations
- Migration guide from datums

## Backward Compatibility

✅ **Fully backward compatible**
- Old descriptors without `parts` still work
- Constraints with `datums` (legacy) still work
- `axisPoint` optional - omit to rotate around part origin
- Reference points optional - omit to use entity node directly

Priority order for measurement:
1. `referencePoints` (new)
2. `datums` (legacy)
3. Entity node itself (fallback)

## Testing Considerations

### Unit Tests Needed
1. Reference point resolution with cached/non-cached access
2. Rotation around arbitrary points vs origin
3. Reference point invalidation after moves
4. Descriptor parsing with/without parts array
5. Constraint measurement from reference points vs datums

### Integration Tests
1. Full gripper simulation with reference-point-based joints
2. Complex multi-body assembly with varying pivot points
3. Constraint solver with reference points
4. Performance with cache hits/misses

## Example Usage

### Simple Gripper (Arbitrary Pivot Points)

```json
{
  "parts": [
    {
      "name": "finger_left",
      "referencePoints": {
        "pivot": { "x": -10, "y": 0, "z": 0 }
      }
    },
    {
      "name": "finger_right",
      "referencePoints": {
        "pivot": { "x": 10, "y": 0, "z": 0 }
      }
    }
  ],
  "joints": [
    {
      "node": "finger_left",
      "axis": [0, 1, 0],
      "axisPoint": "pivot"
    },
    {
      "node": "finger_right",
      "axis": [0, 1, 0],
      "axisPoint": "pivot"
    }
  ]
}
```

Result: Each finger rotates around its own pivot point independently

## Performance Impact

- **Reference point lookup:** O(1) with caching
- **Cache invalidation:** O(n) where n = references to part (typically small)
- **Arbitrary rotation math:** ~3 vector operations per joint per frame
- **Memory:** Maps store part definitions and cached positions

Overall impact: **Negligible** for typical assemblies

## Future Enhancements

1. Reference edges (lines in local coordinates)
2. Reference circles/cylinders for alignment constraints
3. Automatic reference point generation from mesh geometry
4. Visual debugging: show reference points/planes in 3D view
5. Constraint conflict resolution with reference points
6. Multi-body dynamics support with reference-based contacts
