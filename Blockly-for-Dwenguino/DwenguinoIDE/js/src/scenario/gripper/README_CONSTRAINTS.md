# SolidWorks Constraints Implementation Summary

## What Was Added

A complete SolidWorks constraint system has been integrated into the gripper scenario. You can now export mechanical constraints from SolidWorks and import them into the Dwenguino gripper simulator.

## Supported Constraints (9 Types)

1. **Horizontal** - Forces edge/plane to be level
2. **Vertical** - Forces edge/plane to be upright  
3. **Collinear** - Forces points/edges to align on same line
4. **Perpendicular** - Forces 90° relationship between elements
5. **Parallel** - Forces elements to have same orientation
6. **Tangent** - Forces surfaces/curves to touch smoothly
7. **Concentric** - Forces elements to share same center point
8. **Coincident** - Forces points/edges to occupy same location
9. **Equal** - Forces elements to have equal dimensions

## How to Use

### 1. Create Your SolidWorks Model
- Design your gripper in SolidWorks with all constraints
- Note the part names (these become JSON entity names)
- Export as GLB: File > Save As > GLTF Binary (.glb)

### 2. Create JSON Descriptor
Use the template: `example_descriptor_with_constraints.json`

```json
{
  "joints": [...],
  "constraints": [
    {
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"]
    }
  ]
}
```

### 3. Upload to Simulator
- Open Dwenguino IDE
- Select "Gripper" scenario  
- Upload GLB model
- Upload JSON descriptor

## Key Files

- **dwenguino_simulation_scenario_gripper.js** - Main implementation (~/scenarios/gripper/)
  - `initializeConstraints()` - Validates constraints from descriptor
  - `applyConstraints()` - Main constraint solver called every frame
  - 9 constraint type implementations (applyHorizontalConstraint, etc.)

- **CONSTRAINTS_DOCUMENTATION.md** - Complete constraint reference
  - All 9 constraint types explained
  - Examples for each constraint type
  - Troubleshooting guide

- **SOLIDWORKS_MAPPING_GUIDE.md** - How to export from SolidWorks
  - Step-by-step translation guide
  - SolidWorks → JSON mapping
  - Common mistakes to avoid
  - Debugging tips

- **example_descriptor_with_constraints.json** - Template to copy
  - Ready-to-use descriptor format
  - Shows servo + constraint definition together

## Architecture

### Descriptor Format
```json
{
  "version": 1,
  "model": { "upAxis": "Y", "scale": 1 },
  "joints": [...],
  "constraints": [
    {
      "id": "unique_id",
      "type": "ConstraintType",
      "entities": ["part_name_1", "part_name_2"],
      "description": "What this constraint does"
    }
  ]
}
```

### Execution Flow
1. **Load Model** → Upload GLB file
2. **Parse Descriptor** → Read constraints array
3. **Initialize Constraints** → Map entity names to Three.js nodes
4. **Each Frame** → Apply servo angles → Apply constraints → Render

### Constraint Solver
- Applied AFTER servo state
- Modifies joint rotations and positions to satisfy constraints
- Uses Three.js quaternion math and vector operations
- Runs every frame for continuous enforcement

## Technical Implementation

### Key Methods
```javascript
// Initialize constraints from descriptor
initializeConstraints()

// Validate and resolve entity references  
// Apply all constraints every frame
applyConstraints()

// Individual constraint implementations
applyHorizontalConstraint(constraint)
applyVerticalConstraint(constraint)
applyCollinearConstraint(constraint)
// ... etc for all 9 types
```

### Math Used
- **Quaternion rotation**: Three.js Quaternion for smooth orientation
- **Vector projection**: Normal vectors for constraint alignment
- **3D cross products**: For perpendicular constraint calculations
- **Bounding box**: For equal dimension constraints
- **World/local transforms**: Position and orientation calculations

## Integration Points

### Modified Files
1. **dwenguino_simulation_scenario_gripper.js**
   - Added `constraints` property (line ~87)
   - Added `initializeConstraints()` method
   - Added `applyConstraints()` method
   - Added 9 constraint solver methods
   - Modified `updateScenarioState()` to call constraints (line ~788)
   - Constraint documentation in setupControlPanel() JSDoc

### No Breaking Changes
- Existing functionality preserved
- Constraints optional (empty array if not defined)
- Backward compatible with old descriptors

## Usage Examples

### Simple Parallel Jaw Gripper
```json
{
  "constraints": [
    {"type": "Parallel", "entities": ["jaw_left", "jaw_right"]},
    {"type": "Concentric", "entities": ["jaw_left", "jaw_right"]}
  ]
}
```

### Three-Finger Gripper
```json
{
  "constraints": [
    {
      "type": "Collinear",
      "entities": ["finger_left", "finger_center", "finger_right"]
    }
  ]
}
```

### Complex Scissor Lift
```json
{
  "constraints": [
    {"type": "Parallel", "entities": ["upper_left", "upper_right"]},
    {"type": "Parallel", "entities": ["lower_left", "lower_right"]},
    {"type": "Concentric", "entities": ["upper_left", "upper_right", "lower_left", "lower_right"]},
    {"type": "Equal", "entities": ["upper_left", "lower_left"]}
  ]
}
```

## Performance Considerations

- **Typical constraints**: 0-5 for most grippers
- **Maximum recommended**: 10 constraints per scenario
- **Frame rate**: Should maintain 60 FPS
- **Constraint application**: O(n) where n = number of constraints
- **Optimization**: Constraints applied in order, last wins on conflicts

## Debugging

### Browser Console Warnings
```
"Joint node not found: arm"  → Check GLB has node named "arm"
"Constraint entity not found: jaw_left" → Check entity spelling
"Unknown constraint type: InvalidType" → Use standard type names
```

### Testing Constraints
1. Upload GLB and descriptor
2. Open DevTools (F12)
3. Check console for warnings
4. Verify constraint application by observation
5. Use axes helper to debug rotation axes

## Future Enhancements

Potential additions (not yet implemented):
- Distance constraints (maintain gap between parts)
- Angle constraints (enforce specific angles)
- Velocity constraints (limit movement speed)
- Physics-based constraint solving (Cannon-es integration)
- Constraint visualization (highlight constrained parts)
- Constraint editor UI (add/remove constraints in browser)

## Documentation Files

Located in: `Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/gripper/`

1. **CONSTRAINTS_DOCUMENTATION.md** (this file in comment form)
   - 9 constraint types explained
   - Complete examples
   - SolidWorks export workflow

2. **SOLIDWORKS_MAPPING_GUIDE.md**
   - How to translate SolidWorks constraints to JSON
   - Common mistakes
   - Debugging checklist

3. **example_descriptor_with_constraints.json**
   - Copy-paste template
   - All fields documented

4. **CODE COMMENTS** in dwenguino_simulation_scenario_gripper.js
   - setupControlPanel() includes example descriptor
   - Each constraint method has JSDoc explaining behavior

## Support & Troubleshooting

### Problem: Constraints not applying
**Solution**: Check entity names match GLB node names exactly (case-sensitive)

### Problem: Gripper behaves unexpectedly  
**Solution**: Remove constraints one by one to isolate conflict

### Problem: Performance slow
**Solution**: Reduce number of constraints, profile with DevTools

### Problem: Can't find GLB node names
**Solution**: Use Three.js console: `scene.traverse(obj => console.log(obj.name))`

## References

- Three.js Quaternion: https://threejs.org/docs/#api/en/math/Quaternion
- Three.js Vector3: https://threejs.org/docs/#api/en/math/Vector3
- SolidWorks Assembly Mates: Search "SolidWorks assembly mates" in official docs
- glTF Format: https://github.com/KhronosGroup/glTF/tree/main/specification/2.0

