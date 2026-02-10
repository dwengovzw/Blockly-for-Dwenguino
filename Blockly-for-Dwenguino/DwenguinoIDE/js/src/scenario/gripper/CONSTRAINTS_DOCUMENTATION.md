# SolidWorks Constraints in Gripper Simulation

This gripper scenario supports importing mechanical constraints directly from SolidWorks assemblies. Constraints allow you to define relationships between parts that enforce specific geometric properties during simulation.

## Supported Constraint Types

### 1. **Horizontal**
Forces an edge or plane normal to be horizontal (parallel to XZ plane in Three.js).
- **Entities**: 1 (the edge/plane to constrain)
- **Use case**: Keep base platform level, ensure gripper jaws remain at same height

```json
{
  "type": "Horizontal",
  "entities": ["base_platform"],
  "description": "Base remains horizontal"
}
```

### 2. **Vertical**
Forces an edge or plane normal to be vertical (parallel to Y-axis).
- **Entities**: 1 (the edge/plane to constrain)
- **Use case**: Ensure mounting posts are vertical, keep sides perpendicular to ground

```json
{
  "type": "Vertical",
  "entities": ["support_post"],
  "description": "Support post is vertical"
}
```

### 3. **Collinear**
Forces multiple edges or points to lie on the same line.
- **Entities**: 2 or more (edges/points to align)
- **Use case**: Keep multiple gripper fingers aligned along same axis

```json
{
  "type": "Collinear",
  "entities": ["finger_left", "finger_center", "finger_right"],
  "description": "All fingers on same line"
}
```

### 4. **Perpendicular**
Forces two edges to be perpendicular (exactly 90° apart).
- **Entities**: 2 (the edges to constrain)
- **Use case**: Ensure jaw motion is perpendicular to gripper body, cross-arm constraints

```json
{
  "type": "Perpendicular",
  "entities": ["jaw_left", "body"],
  "description": "Left jaw perpendicular to body"
}
```

### 5. **Parallel**
Forces two edges or planes to have the same orientation (parallel).
- **Entities**: 2 or more (edges/planes to align)
- **Use case**: Keep parallel linkages in sync, ensure symmetric gripper motion

```json
{
  "type": "Parallel",
  "entities": ["jaw_left", "jaw_right"],
  "description": "Both jaws remain parallel during actuation"
}
```

### 6. **Tangent**
Forces two curves or surfaces to be tangent (touching without penetration).
- **Entities**: 2 (the curves/surfaces to constrain)
- **Use case**: Smooth finger transitions, prevent geometry clipping

```json
{
  "type": "Tangent",
  "entities": ["finger_tip", "object_surface"],
  "description": "Finger tip tangent to gripped object"
}
```

### 7. **Concentric**
Forces two or more entities to share the same center point.
- **Entities**: 2 or more (the elements to align)
- **Use case**: Rotating joints, pivot points for parallel mechanisms

```json
{
  "type": "Concentric",
  "entities": ["jaw_left", "jaw_right"],
  "description": "Jaws share same rotation center"
}
```

### 8. **Coincident**
Forces points or edges to occupy the same location.
- **Entities**: 2 or more (points/edges to align)
- **Use case**: Link disconnected geometry, synchronize multiple actuators

```json
{
  "type": "Coincident",
  "entities": ["servo_arm", "jaw_pivot"],
  "description": "Servo arm and jaw pivot at same point"
}
```

### 9. **Equal**
Forces entities to have equal dimensions or radii.
- **Entities**: 2 or more (elements with comparable dimensions)
- **Use case**: Symmetric gripper design, ensure matched component sizes

```json
{
  "type": "Equal",
  "entities": ["jaw_left", "jaw_right"],
  "description": "Both jaws have identical size"
}
```

## Complete Descriptor Example

Here's a complete descriptor for a parallel-jaw gripper with SolidWorks constraints:

```json
{
  "version": 1,
  "model": {
    "upAxis": "Y",
    "scale": 1
  },
  "joints": [
    {
      "name": "jaw_left",
      "node": "jaw_left",
      "type": "revolute",
      "axis": [0, 0, -1],
      "minDeg": 0,
      "maxDeg": 90,
      "servo": {
        "index": 1,
        "min": 0,
        "max": 180,
        "invert": false
      }
    },
    {
      "name": "jaw_right",
      "node": "jaw_right",
      "type": "revolute",
      "axis": [0, 0, 1],
      "minDeg": 0,
      "maxDeg": 90,
      "servo": {
        "index": 2,
        "min": 0,
        "max": 180,
        "invert": true
      }
    }
  ],
  "constraints": [
    {
      "id": "parallel_jaws",
      "type": "Parallel",
      "entities": ["jaw_left", "jaw_right"],
      "description": "Keep both jaws parallel during motion"
    },
    {
      "id": "concentric_rotation",
      "type": "Concentric",
      "entities": ["jaw_left", "jaw_right"],
      "description": "Jaws rotate about same center point"
    },
    {
      "id": "horizontal_base",
      "type": "Horizontal",
      "entities": ["base"],
      "description": "Base platform remains horizontal"
    },
    {
      "id": "finger_alignment",
      "type": "Collinear",
      "entities": ["finger_left", "finger_center", "finger_right"],
      "description": "All fingers aligned on same axis"
    }
  ]
}
```

## How to Export from SolidWorks

### Step 1: Create Assembly with Constraints
1. In SolidWorks, create your gripper assembly
2. Add all constraints (Parallel, Concentric, etc.) to define part relationships
3. Note the part names and constraint types in the assembly tree

### Step 2: Export GLB Model
1. Go to **File > Save As**
2. Select **Save as type: GLTF Binary (.glb)**
3. Save the file (e.g., `gripper.glb`)

### Step 3: Create JSON Descriptor
1. Open a text editor
2. Copy the template above
3. Replace part names with your actual SolidWorks part names (must match GLB node names exactly)
4. Replace servo indices (1, 2, 3...) with your hardware configuration
5. List all constraints with their corresponding part relationships

### Step 4: Upload to Simulator
1. Open the Dwenguino IDE in browser
2. Select "Gripper" scenario
3. In the control panel (bottom-left):
   - Upload your `gripper.glb` file
   - Upload your constraint descriptor JSON file
4. The simulator will parse constraints and apply them during animation

## Important Notes

### Part Name Matching
- **Node names in GLB must match exactly** with entity names in your descriptor
- Use `getObjectByName()` friendly names (no spaces, no special characters)
- In SolidWorks, part names are typically: `Part1@Assembly`, `Part2@Assembly`, etc.
- Rename parts in GLB export to match your descriptor

### Constraint Application Order
Constraints are applied in the order they appear in the descriptor array. If constraints conflict, the last one takes precedence. Order matters for complex mechanical systems.

### Coordinate Systems
- X-axis: Left/Right (Red in axes helper)
- Y-axis: Up/Down (Green in axes helper)
- Z-axis: Forward/Backward (Blue in axes helper)
- SolidWorks typically uses different conventions; use `upAxis` field to convert

### Performance Considerations
Each constraint adds computational overhead. For smooth simulation:
- Limit constraints to < 10 per scenario
- Use only necessary constraints for your mechanism
- Constraints are applied every frame; avoid redundant constraints

### Debugging Constraints
If constraints don't appear to work:
1. Check browser console for warnings about missing entities
2. Verify part names match exactly between GLB and descriptor
3. Test with simpler constraints first (e.g., Horizontal)
4. Use the axes helper to verify coordinate system

## Example: Scissor Lift Gripper

A scissor lift requires:
- Parallel constraints (maintain linkage parallelism)
- Collinear constraints (keep pivot points aligned)
- Equal constraints (symmetric design)

```json
{
  "constraints": [
    {
      "id": "upper_links_parallel",
      "type": "Parallel",
      "entities": ["upper_link_left", "upper_link_right"]
    },
    {
      "id": "lower_links_parallel",
      "type": "Parallel",
      "entities": ["lower_link_left", "lower_link_right"]
    },
    {
      "id": "left_symmetric",
      "type": "Equal",
      "entities": ["upper_link_left", "lower_link_left"]
    },
    {
      "id": "right_symmetric",
      "type": "Equal",
      "entities": ["upper_link_right", "lower_link_right"]
    },
    {
      "id": "center_pivot",
      "type": "Concentric",
      "entities": ["upper_link_left", "upper_link_right", "lower_link_left", "lower_link_right"]
    }
  ]
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Constraints not applying | Check entity names match GLB node names exactly |
| Gripper behaves strangely | Remove constraints one by one to isolate the issue |
| Performance degradation | Reduce number of constraints, check for conflicts |
| Parts penetrating | Use Tangent constraint to prevent intersection |
| Motion feels jerky | Constraints may conflict; review constraint order |

For more information, see the gripper scenario code in:
`DwenguinoIDE/js/src/scenario/gripper/dwenguino_simulation_scenario_gripper.js`
