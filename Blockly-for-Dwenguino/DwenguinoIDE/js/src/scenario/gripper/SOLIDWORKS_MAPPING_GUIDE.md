# SolidWorks to JSON Constraint Mapping Guide

This guide shows how to translate SolidWorks assembly constraints into JSON descriptors for the Dwenguino gripper simulator.

## SolidWorks Constraint → JSON Type Mapping

| SolidWorks Constraint | JSON Type | Notes |
|----------------------|-----------|-------|
| Horizontal (Edge) | `Horizontal` | Plane/edge remains level |
| Vertical (Edge) | `Vertical` | Plane/edge remains upright |
| Collinear | `Collinear` | Multiple edges on same line |
| Perpendicular | `Perpendicular` | 90° relationship between two faces/edges |
| Parallel | `Parallel` | Same orientation, no angular difference |
| Tangent | `Tangent` | Surfaces/curves touch smoothly |
| Concentric | `Concentric` | Same center point (for circles/cylinders) |
| Coincident | `Coincident` | Points/edges at exact same location |
| Equal | `Equal` | Same dimensions or radii |

## Step-by-Step Translation Example

### Example: Parallel-Jaw Gripper

**In SolidWorks Assembly:**
```
Assembly: Gripper
├── base (fixed, origin)
├── jaw_left
│   └── Revolute Mate around Z-axis
│   └── Parallel constraint (to jaw_right)
├── jaw_right
│   └── Revolute Mate around Z-axis
│   └── Parallel constraint (to jaw_left)
└── finger (optional, coincident to one jaw)
```

**Translation Steps:**

1. **Identify part names**: `base`, `jaw_left`, `jaw_right`
2. **Note joint types**: Revolute joints around Z-axis
3. **List constraints**:
   - Parallel between jaw_left and jaw_right
   - Both jaws share same rotation center (Concentric)
   - Base stays horizontal

**Resulting JSON:**
```json
{
  "joints": [
    {
      "name": "jaw_left",
      "node": "jaw_left",
      "type": "revolute",
      "axis": [0, 0, -1],
      "minDeg": 0,
      "maxDeg": 90,
      "servo": {"index": 1, "min": 0, "max": 180}
    },
    {
      "name": "jaw_right",
      "node": "jaw_right",
      "type": "revolute",
      "axis": [0, 0, 1],
      "minDeg": 0,
      "maxDeg": 90,
      "servo": {"index": 2, "min": 0, "max": 180, "invert": true}
    }
  ],
  "constraints": [
    {
      "id": "parallel_constraint",
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"]
    },
    {
      "id": "concentric_constraint",
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"]
    }
  ]
}
```

## Getting Part Names from SolidWorks GLB Export

### Method 1: Using Three.js Inspector
1. Upload GLB to simulator
2. Open browser DevTools (F12)
3. Run in console:
```javascript
// Find all named objects in loaded model
scene.traverse(obj => {
  if (obj.name) console.log(obj.name);
});
```

### Method 2: Using glTF Validator
1. Download your exported GLB file
2. Use online validator: https://github.khronos.org/glTF-Validator/
3. Check "Node" section for all part names

### Method 3: Manual Inspection in Blender
1. Open GLB in Blender (free 3D editor)
2. Check "Outliner" panel on right
3. All part names visible in hierarchy

## Complex Example: Scissor Lift Gripper

**SolidWorks Constraints:**
```
- Upper_Link_Left parallel to Upper_Link_Right
- Lower_Link_Left parallel to Lower_Link_Right
- All four links share center point (concentric)
- Upper and lower links on same centerline (collinear)
- Left and right sides symmetric (equal dimensions)
```

**JSON Translation:**
```json
{
  "constraints": [
    {
      "id": "upper_parallel",
      "type": "Parallel",
      "entities": ["upper_link_left", "upper_link_right"]
    },
    {
      "id": "lower_parallel",
      "type": "Parallel",
      "entities": ["lower_link_left", "lower_link_right"]
    },
    {
      "id": "center_concentric",
      "type": "Concentric",
      "entities": [
        "upper_link_left",
        "upper_link_right",
        "lower_link_left",
        "lower_link_right"
      ]
    },
    {
      "id": "vertical_alignment",
      "type": "Collinear",
      "entities": ["upper_link_left", "lower_link_left"]
    },
    {
      "id": "symmetric_left",
      "type": "Equal",
      "entities": ["upper_link_left", "lower_link_left"]
    },
    {
      "id": "symmetric_right",
      "type": "Equal",
      "entities": ["upper_link_right", "lower_link_right"]
    }
  ]
}
```

## Common Mistakes to Avoid

❌ **Wrong**: Using SolidWorks constraint names directly
```json
{"type": "Parallel Mate"}  // WRONG
```

✅ **Correct**: Use standardized JSON types
```json
{"type": "Parallel"}  // CORRECT
```

---

❌ **Wrong**: Part names with spaces or special characters
```json
{"entities": ["jaw left", "jaw-right"]}  // WRONG
```

✅ **Correct**: Use exact GLB node names (typically no spaces)
```json
{"entities": ["jaw_left", "jaw_right"]}  // CORRECT
```

---

❌ **Wrong**: Forgetting to list all entities
```json
{"type": "Parallel", "entities": ["jaw_left"]}  // WRONG - needs 2+ for Parallel
```

✅ **Correct**: Provide all required entities
```json
{"type": "Parallel", "entities": ["jaw_left", "jaw_right"]}  // CORRECT
```

---

❌ **Wrong**: Using identical entity names
```json
{"entities": ["jaw", "jaw"]}  // WRONG - ambiguous
```

✅ **Correct**: Use unique identifiers
```json
{"entities": ["jaw_left", "jaw_right"]}  // CORRECT
```

## Debugging Your Constraints

### Check 1: Entity Names Match
```javascript
// In browser console after loading model:
console.log("Looking for jaw_left:", scene.getObjectByName("jaw_left"));
console.log("Looking for jaw_right:", scene.getObjectByName("jaw_right"));
// Should return Three.js objects, not null
```

### Check 2: Constraint Order Matters
- Apply constraints in dependency order
- Base constraints first, then dependent constraints
- Example: Set Horizontal first, then Parallel

### Check 3: Monitor Constraint Application
```javascript
// Observe constraint solver during animation
// Open DevTools and watch for constraint warnings in console
// If entities not found, you'll see: "Constraint entity not found: ..."
```

## Performance Optimization Tips

1. **Minimize constraints**: Each constraint adds computation
   - Use only constraints necessary for behavior
   - Combine multiple goals into single constraints where possible

2. **Constraint conflict resolution**:
   - Last constraint wins if conflicts occur
   - Order constraints by priority (most important last)

3. **Test performance**:
   - Monitor frame rate (DevTools > Performance)
   - Typical target: 60 FPS
   - >10 constraints may cause slowdown

## Validation Checklist

Before uploading your descriptor:
- [ ] All part names match GLB node names exactly
- [ ] Constraint types are in JSON format (Parallel, not "Parallel Mate")
- [ ] Each constraint has required fields: `type`, `entities`
- [ ] Entity lists have correct number of elements (e.g., Parallel needs 2+)
- [ ] JSON syntax is valid (no trailing commas, proper quotes)
- [ ] Servo indices match your hardware (1, 2, 3...)
- [ ] Axis vectors are normalized [0,0,1] not [0,0,2]

## Additional Resources

- Three.js Documentation: https://threejs.org/docs/
- glTF Format Specification: https://github.com/KhronosGroup/glTF
- SolidWorks Assembly mates: https://help.solidworks.com/2023/English/SolidWorks/sldworks/t_assembly_mates.htm

