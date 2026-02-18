# Quick Reference: Reference Geometry System

## At a Glance

**Reference Points:** Define measurement geometry per part (local coordinates)  
**Arbitrary Axes:** Joints rotate around any point, not just origin

## Minimal Example

### Descriptor Structure
```json
{
  "parts": [
    {
      "name": "jaw_left",
      "referencePoints": {
        "pivot": { "x": -30, "y": 20, "z": 0 },
        "gripPoint": { "x": -55, "y": 20, "z": 0 }
      }
    }
  ],
  "joints": [
    {
      "node": "jaw_left",
      "axis": [0, 0, 1],
      "axisPoint": "pivot"
    }
  ],
  "constraints": [
    {
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"],
      "referencePoints": ["pivot", "pivot"]
    }
  ]
}
```

## Part Name Mapping

| GLB File | Descriptor | What It Does |
|----------|-----------|--------------|
| Node name: "jaw_left" | parts[].name: "jaw_left" | ✓ Part identified |
| (no export needed) | referencePoints: {...} | ✓ Geometry defined locally |
| (no export needed) | joints[].node: "jaw_left" | ✓ Joint attached |
| (no export needed) | joints[].axisPoint: "pivot" | ✓ Rotation center |

## Key Differences

### Before (Attempted Datums)
```json
// ❌ Doesn't work - datums can't be exported from SolidWorks
"datums": ["jaw_left_datum_node"]
// ❌ Joints always rotate around origin
"axis": [0, 0, 1]
```

### After (Reference Points)
```json
// ✅ Works - defined in descriptor, no export needed
"referencePoints": {
  "pivot": { "x": -30, "y": 20, "z": 0 }
}
// ✅ Joints rotate around specified point
"axisPoint": "pivot"
```

## Coordinate System

**Reference points are in LOCAL coordinates relative to the part:**

```
Part "jaw_left" in GLB file positioned at world (100, 50, 0)

Descriptor says:
"pivot": { "x": -30, "y": 20, "z": 0 }

This means:
- 30 units LEFT of jaw_left's center
- 20 units UP from jaw_left's center
- In jaw_left's own coordinate frame

World position of pivot ≈ (70, 70, 0)
- Calculated automatically when needed
- Cached for performance
- Recalculated when part moves
```

## Common Patterns

### 1. Gripper with Arbitrary Pivots
```json
"parts": [
  {
    "name": "finger_left",
    "referencePoints": {
      "pivot": { "x": -10, "y": 0, "z": 0 }
    }
  }
],
"joints": [
  {
    "node": "finger_left",
    "axisPoint": "pivot"
  }
]
```
→ Finger rotates around its pivot, not its center

### 2. Constrain at Reference Points
```json
"constraints": [
  {
    "type": "Parallel",
    "entities": ["jaw_left", "jaw_right"],
    "referencePoints": ["gripSurface", "gripSurface"]
  }
]
```
→ Measures orientation at gripSurface, applies to parts

### 3. Mix Reference Points and Datums
```json
"constraints": [
  {
    "type": "Horizontal",
    "entities": ["base"],
    "referencePoints": ["topSurface"]  // New way
  },
  {
    "type": "Fixed",
    "entities": ["part"],
    "datums": ["part_datum_node"]      // Old way still works
  }
]
```
→ Can use both - reference points take priority

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Part doesn't rotate right | axisPoint not set | Add `"axisPoint": "pivot"` to joint |
| Constraint ignores measurement | Reference point not found | Check spelling in `referencePoints` array |
| Rotation around wrong point | axisPoint references wrong part | Reference point names are per-part, check part definition |
| Performance slow | Large assembly | Check browser console for cache stats |

## API Cheat Sheet

### Get Reference Point World Position
```javascript
const worldPos = this.getReferencePointWorldPosition("jaw_left", "pivot");
// → THREE.Vector3 in world coordinates
```

### Get Reference Plane
```javascript
const plane = this.getReferencePlaneWorld("jaw_left", "gripFace");
// → { normal: Vector3, point: Vector3 }
```

### Get Part Definition
```javascript
const partDef = this.getPartDefinition("jaw_left");
// → { name, referencePoints, referencePlanes }
```

### Invalidate Cache
```javascript
this.invalidateReferencePointCache("jaw_left");
// Called automatically during constraint solving
```

## JSON Schema Snippets

### Part Definition
```json
{
  "name": "string (GLB node name)",
  "referencePoints": {
    "pointName": { "x": number, "y": number, "z": number }
  },
  "referencePlanes": {
    "planeName": {
      "normal": [x, y, z],
      "point": [x, y, z]
    }
  }
}
```

### Joint with Axis Point
```json
{
  "node": "string (GLB node name)",
  "axis": [x, y, z],
  "axisPoint": "string (reference point name)"
  // OR
  "axisPoint": { "x": number, "y": number, "z": number }
}
```

### Constraint with Reference Points
```json
{
  "type": "string (constraint type)",
  "entities": ["part1", "part2"],
  "referencePoints": ["refPoint1", "refPoint2"],
  "weight": number (0.0-1.0)
}
```

## Learning Resources

- **REFERENCE_GEOMETRY_GUIDE.md** - Complete architectural guide
- **example_descriptor_with_reference_points.json** - Working example
- **setupControlPanel()** documentation - Comprehensive format guide
- **IMPLEMENTATION_NOTES.md** - Technical implementation details
