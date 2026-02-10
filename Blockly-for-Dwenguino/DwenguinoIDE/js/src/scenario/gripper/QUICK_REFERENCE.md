# Quick Reference: SolidWorks Constraints in Gripper Simulator

## At a Glance

| Constraint | Purpose | Entities | JSON Example |
|-----------|---------|----------|--------------|
| **Horizontal** | Keep level | 1 | `{"type":"Horizontal","entities":["base"]}` |
| **Vertical** | Keep upright | 1 | `{"type":"Vertical","entities":["post"]}` |
| **Collinear** | Align on line | 2+ | `{"type":"Collinear","entities":["f1","f2","f3"]}` |
| **Perpendicular** | 90° angle | 2 | `{"type":"Perpendicular","entities":["j1","j2"]}` |
| **Parallel** | Same orientation | 2+ | `{"type":"Parallel","entities":["j1","j2"]}` |
| **Tangent** | Touch smoothly | 2 | `{"type":"Tangent","entities":["s1","s2"]}` |
| **Concentric** | Share center | 2+ | `{"type":"Concentric","entities":["c1","c2"]}` |
| **Coincident** | Same location | 2+ | `{"type":"Coincident","entities":["p1","p2"]}` |
| **Equal** | Equal size | 2+ | `{"type":"Equal","entities":["j1","j2"]}` |

## 3-Step Process

### Step 1: SolidWorks
```
1. Design assembly with constraints
2. Export → File > Save As > GLTF Binary (.glb)
3. Note part names from assembly tree
```

### Step 2: Create JSON
```json
{
  "version": 1,
  "joints": [{"name":"jaw_left","node":"jaw_left",...}],
  "constraints": [
    {"type":"Parallel","entities":["jaw_left","jaw_right"]},
    {"type":"Concentric","entities":["jaw_left","jaw_right"]}
  ]
}
```

### Step 3: Upload
```
1. Open Dwenguino IDE
2. Select Gripper scenario
3. Upload GLB model + JSON descriptor
4. Done!
```

## Minimal Descriptor Template

```json
{
  "version": 1,
  "model": {"upAxis":"Y","scale":1},
  "joints": [
    {
      "name":"jaw_left",
      "node":"jaw_left",
      "type":"revolute",
      "axis":[0,0,-1],
      "minDeg":0,
      "maxDeg":90,
      "servo":{"index":1,"min":0,"max":180}
    }
  ],
  "constraints": [
    {"type":"Horizontal","entities":["base"]}
  ]
}
```

## Common Issues & Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| Constraints not working | Entity names | Must match GLB node names exactly |
| Parts penetrate | Tangent constraint | Add `{"type":"Tangent","entities":["p1","p2"]}` |
| Wrong part found | Spelling/case | Names are case-sensitive |
| JSON error | Syntax | Use JSON validator: jsonlint.com |
| Performance slow | Constraint count | Keep under 10 constraints |

## Console Commands for Debugging

```javascript
// List all node names in loaded model
scene.traverse(obj => obj.name && console.log(obj.name))

// Check if specific node exists
scene.getObjectByName("jaw_left")  // Returns object or null

// Check constraints loaded
console.log(scenario.constraints)  // Array of constraint objects
```

## File Locations

```
DwenguinoIDE/js/src/scenario/gripper/
├── dwenguino_simulation_scenario_gripper.js  (main code)
├── README_CONSTRAINTS.md                     (overview)
├── CONSTRAINTS_DOCUMENTATION.md              (detailed guide)
├── SOLIDWORKS_MAPPING_GUIDE.md              (export workflow)
└── example_descriptor_with_constraints.json (template)
```

## Getting Part Names from SolidWorks GLB

### In Browser Console
```javascript
// After uploading GLB, run this to see all part names:
let names = [];
scene.traverse(obj => {
  if (obj.name && obj.isMesh) names.push(obj.name);
});
console.table(names);
```

### Using Online Tool
Visit: https://github.khronos.org/glTF-Validator/
Upload your GLB → Look under "Nodes" section

### In Blender (Free)
1. Open GLB in Blender
2. Right panel → "Outliner"
3. All part names listed in tree

## Constraint Application Order

Constraints are applied in JSON array order. Set priorities like this:

```json
{
  "constraints": [
    {"type":"Horizontal","entities":["base"]},        // 1st - stabilize base
    {"type":"Parallel","entities":["j1","j2"]},       // 2nd - align motion
    {"type":"Concentric","entities":["j1","j2"]},     // 3rd - set pivot
    {"type":"Tangent","entities":["tip","object"]}    // 4th - prevent clip
  ]
}
```

## Constraint Math

- **Horizontal/Vertical**: Uses cross product to find rotation
- **Collinear**: Aligns normals between entities
- **Perpendicular**: Creates 90° using cross product
- **Parallel**: Matches entity normals
- **Tangent**: Aligns normals for smooth contact
- **Concentric**: Moves entities to shared center point
- **Coincident**: Aligns positions to reference entity
- **Equal**: Scales smaller entity to match larger

## Export Checklist

Before uploading descriptor JSON:
- ✓ GLB file uploaded first
- ✓ Part names match exactly (case-sensitive!)
- ✓ Constraint types are capitalized: `Horizontal` not `horizontal`
- ✓ Each constraint has `type` and `entities` fields
- ✓ `entities` array has correct number of elements (e.g., 2+ for Parallel)
- ✓ JSON syntax valid (no trailing commas)
- ✓ Servo indices match hardware: 1, 2, 3...
- ✓ Axes normalized: [0,0,1] not [0,0,2]

## Performance Tips

- **Best**: 0-3 constraints (lightweight, fast)
- **Good**: 4-6 constraints (normal speed, typical grippers)
- **Okay**: 7-10 constraints (slight slowdown, complex mechanisms)
- **Slow**: >10 constraints (avoid, conflicts likely)

## Real-World Examples

### Parallel Jaw (Minimal)
```json
{"constraints":[
  {"type":"Parallel","entities":["jaw_L","jaw_R"]},
  {"type":"Concentric","entities":["jaw_L","jaw_R"]}
]}
```

### 3-Finger (Symmetric)
```json
{"constraints":[
  {"type":"Collinear","entities":["f1","f2","f3"]},
  {"type":"Equal","entities":["f1","f2","f3"]}
]}
```

### Scissor Lift (Complex)
```json
{"constraints":[
  {"type":"Parallel","entities":["top_L","top_R"]},
  {"type":"Parallel","entities":["bot_L","bot_R"]},
  {"type":"Concentric","entities":["top_L","top_R","bot_L","bot_R"]},
  {"type":"Equal","entities":["top_L","top_R","bot_L","bot_R"]}
]}
```

## Support Resources

- **Complete Guide**: `CONSTRAINTS_DOCUMENTATION.md`
- **Export Guide**: `SOLIDWORKS_MAPPING_GUIDE.md`
- **Example**: `example_descriptor_with_constraints.json`
- **Code**: `dwenguino_simulation_scenario_gripper.js` (~1000+ lines, well-commented)

## Next Steps

1. Read `SOLIDWORKS_MAPPING_GUIDE.md` for export workflow
2. Review `CONSTRAINTS_DOCUMENTATION.md` for constraint details
3. Copy `example_descriptor_with_constraints.json` as starting point
4. Create your SolidWorks model and export GLB
5. Modify descriptor with your constraints
6. Upload to simulator and test!

---

**Questions?** Check the detailed documentation files in the gripper scenario folder.
