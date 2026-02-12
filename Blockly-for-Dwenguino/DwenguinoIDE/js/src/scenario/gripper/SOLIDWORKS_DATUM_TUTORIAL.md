# SolidWorks Datum Elements Tutorial for Gripper Constraints

This guide explains how to create and name datum planes, points, and axes in SolidWorks to enable precise constraint enforcement in the gripper simulator.

---

## Why Use Datum Elements?

**Problem:** SolidWorks assembly constraints work on edges, faces, and points of parts, but GLB exports only export part geometry.

**Solution:** Create explicit **datum planes, points, and axes** as reference geometry. These export as named nodes in the GLB file and can be constrained precisely in the simulator.

---

## Part 1: Creating Datum Planes

Datum planes are virtual reference planes that can be constrained (parallel, perpendicular, horizontal, etc.).

### Step-by-Step: Create a Datum Plane

1. **Open your part in Part Design mode**

2. **Insert → Reference Geometry → Plane**
   - Or toolbar: Features → Reference Geometry → Plane

3. **Define the plane:**
   - **First Reference:** Select a face, edge, or existing plane
   - **Constraint:** Choose offset distance, angle, or tangent
   - **Second Reference (optional):** For more complex definitions

4. **Name the plane:**
   - In the FeatureManager tree, right-click the new plane (e.g., `Plane1`)
   - Select **Rename**
   - Give it a descriptive name: `jaw_alignment_plane`, `base_reference_plane`
   - **Important:** Use underscores, no spaces (becomes node name in GLB)

5. **Click OK**

### Common Datum Plane Types

| Type | Use Case | How to Create |
|------|----------|---------------|
| **Parallel Offset** | Create reference above/below a surface | Offset from face by distance |
| **Perpendicular** | Create vertical reference from horizontal | Perpendicular to face through edge |
| **Mid-plane** | Find center between two faces | Midway between two faces |
| **Angled** | Create tilted reference | Angle from reference plane |

### Example: Gripper Jaw Alignment Planes

**Goal:** Create planes on each jaw for parallel constraint

```
1. Select left jaw part
2. Insert → Reference Geometry → Plane
3. First Reference: Select top face of jaw
4. Offset: 0mm (coplanar)
5. Name: "jaw_left_alignment_plane"
6. Repeat for right jaw: "jaw_right_alignment_plane"
```

---

## Part 2: Creating Datum Points

Datum points are virtual reference points (e.g., pivot centers, contact points).

### Step-by-Step: Create a Datum Point

1. **Open your part in Part Design mode**

2. **Insert → Reference Geometry → Point**
   - Or toolbar: Features → Reference Geometry → Point

3. **Define the point location:**
   
   **Option A: Vertex/Point**
   - Select an existing vertex or endpoint
   
   **Option B: Center of Face/Edge**
   - Select a circular face or arc edge
   - Point will be at center
   
   **Option C: Intersection**
   - Select three planes/faces
   - Point where they intersect
   
   **Option D: Projection**
   - Project a point onto a face
   
   **Option E: Arc Center**
   - Select an arc or circle

4. **Name the point:**
   - Right-click in tree → Rename
   - Use descriptive name: `jaw_pivot_point`, `gripper_center`
   - **Important:** Use underscores, no spaces

5. **Click OK**

### Common Datum Point Types

| Type | Use Case | How to Create |
|------|----------|---------------|
| **Pivot Center** | Rotation axis center | Arc center or intersection of planes |
| **Contact Point** | Where parts touch | Vertex or projection |
| **Geometric Center** | Center of mass reference | Intersection of three mid-planes |
| **Guide Point** | Path reference | Projection onto face |

### Example: Gripper Pivot Points

**Goal:** Create pivot point for each jaw rotation axis

```
1. Select left jaw part
2. Insert → Reference Geometry → Point
3. Method: "Arc Center"
4. Select the circular pivot hole/shaft
5. Name: "jaw_left_pivot_point"
6. Repeat for right jaw: "jaw_right_pivot_point"
```

---

## Part 3: Creating Datum Axes

Datum axes represent lines (e.g., rotation axes, symmetry lines).

### Step-by-Step: Create a Datum Axis

1. **Open your part in Part Design mode**

2. **Insert → Reference Geometry → Axis**
   - Or toolbar: Features → Reference Geometry → Axis

3. **Define the axis:**
   
   **Option A: Cylindrical/Conical Face**
   - Select a cylinder or cone
   - Axis through center
   
   **Option B: Two Planes**
   - Select two non-parallel planes
   - Axis at intersection
   
   **Option C: Two Points/Vertices**
   - Select two points
   - Axis through both
   
   **Option D: Point and Face/Plane**
   - Axis perpendicular to face through point

4. **Name the axis:**
   - Right-click in tree → Rename
   - Use descriptive name: `jaw_rotation_axis`, `gripper_symmetry_axis`

5. **Click OK**

### Common Datum Axis Types

| Type | Use Case | How to Create |
|------|----------|---------------|
| **Rotation Axis** | Revolute joint axis | Cylinder/hole center |
| **Symmetry Axis** | Mirror line | Two mid-planes intersection |
| **Linear Guide** | Prismatic joint | Two planes intersection |

### Example: Gripper Rotation Axes

**Goal:** Create rotation axis for each jaw

```
1. Select left jaw part
2. Insert → Reference Geometry → Axis
3. Method: "Cylindrical/Conical Face"
4. Select the pivot shaft
5. Name: "jaw_left_rotation_axis"
6. Repeat for right jaw: "jaw_right_rotation_axis"
```

---

## Part 4: Assembly-Level Datum Elements

You can also create datum elements at the **assembly level** for constraints between parts.

### Step-by-Step: Assembly Datum Plane

1. **Open your assembly**

2. **Insert → Reference Geometry → Plane**
   - Works the same as part-level

3. **Reference parts or existing datums:**
   - Select faces/planes from different parts
   - Create cross-part references

4. **Name descriptively:**
   - `assembly_base_plane`, `gripper_closure_plane`

5. **Use in constraints:**
   - These assembly datums appear as nodes in GLB export

---

## Part 5: Naming Conventions

**Critical for simulator integration!**

### Best Practices

✅ **DO:**
- Use descriptive names: `jaw_left_pivot_point`
- Use underscores: `base_reference_plane`
- Include part name: `jaw_left_alignment_plane`
- Be consistent: All left items have `_left`, all right have `_right`
- Use lowercase: `pivot_point` not `Pivot_Point`

❌ **DON'T:**
- Use spaces: `jaw left pivot` → won't work
- Use special characters: `jaw@pivot!` → may fail
- Use generic names: `Plane1`, `Point1` → hard to identify
- Mix naming styles: `jaw-left` vs `jaw_right` → inconsistent

### Recommended Naming Patterns

```
Part-level datums:
  [part_name]_[element_type]_[descriptor]
  
  Examples:
  - jaw_left_pivot_point
  - jaw_left_alignment_plane
  - jaw_left_rotation_axis
  - base_reference_plane
  - gripper_center_point

Assembly-level datums:
  assembly_[descriptor]_[element_type]
  
  Examples:
  - assembly_closure_plane
  - assembly_symmetry_plane
  - assembly_base_reference
```

---

## Part 6: Export to GLB with Datum Elements

### Step-by-Step Export

1. **Open your assembly** (with all datum elements created and named)

2. **File → Save As**

3. **Save as type:** Select `GLTF Binary (*.glb)`

4. **File name:** Choose descriptive name (e.g., `gripper_with_datums.glb`)

5. **Click "Options" button** (important!)

6. **Export Settings:**
   - ✅ **Include Reference Geometry** (if available)
   - ✅ **Export all objects/bodies**
   - ✅ **Preserve hierarchy**
   - ⚠️ **DRACO compression:** Optional (simulator supports both)
   - ❌ **Exclude construction geometry:** Unchecked (we want datums!)

7. **Click OK → Save**

### Verify Export

After export, check the GLB file contains your datums:

**Option A: Import back into SolidWorks**
- File → Open → Select GLB file
- Check if datum elements appear

**Option B: Use online GLB viewer**
- https://gltf-viewer.donmccurdy.com/
- Upload GLB file
- Expand node tree on left
- Verify datum names appear

**Option C: Upload to simulator**
- Upload GLB file
- Check browser console for node names
- Look for: `[Gripper] Found node: jaw_left_pivot_point`

---

## Part 7: Creating Constraint Descriptor with Datums

Now that your GLB has named datum elements, reference them in the descriptor:

### Example Descriptor

```json
{
  "version": 1,
  "model": {
    "upAxis": "Y",
    "scale": 10
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
  "constraintSolver": {
    "maxIterations": 10,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true
  },
  "constraints": [
    {
      "id": "parallel_jaw_planes",
      "type": "Parallel",
      "entities": [
        "jaw_left_alignment_plane",
        "jaw_right_alignment_plane"
      ],
      "weight": 1.0,
      "description": "Jaw alignment planes must remain parallel"
    },
    {
      "id": "concentric_pivots",
      "type": "Concentric",
      "entities": [
        "jaw_left_pivot_point",
        "jaw_right_pivot_point"
      ],
      "weight": 0.9,
      "description": "Pivot points should be concentric"
    },
    {
      "id": "base_horizontal",
      "type": "Horizontal",
      "entities": [
        "base_reference_plane"
      ],
      "weight": 0.7,
      "description": "Base reference plane stays horizontal"
    },
    {
      "id": "symmetry_collinear",
      "type": "Collinear",
      "entities": [
        "jaw_left_rotation_axis",
        "jaw_right_rotation_axis"
      ],
      "weight": 1.0,
      "description": "Rotation axes must be collinear (same line)"
    }
  ]
}
```

---

## Part 8: Common Use Cases

### Use Case 1: Parallel Gripper Jaws

**Goal:** Ensure jaws stay parallel during motion

**SolidWorks Setup:**
1. Create datum plane on inside face of left jaw: `jaw_left_grip_plane`
2. Create datum plane on inside face of right jaw: `jaw_right_grip_plane`
3. In assembly, add parallel constraint between these planes

**Descriptor:**
```json
{
  "id": "parallel_gripping",
  "type": "Parallel",
  "entities": ["jaw_left_grip_plane", "jaw_right_grip_plane"],
  "weight": 1.0
}
```

### Use Case 2: Concentric Pivot Points

**Goal:** Ensure rotation pivots align perfectly

**SolidWorks Setup:**
1. Create datum point at center of left jaw pivot hole: `jaw_left_pivot_point`
2. Create datum point at center of right jaw pivot hole: `jaw_right_pivot_point`
3. In assembly, add concentric constraint between pivot shafts

**Descriptor:**
```json
{
  "id": "concentric_pivots",
  "type": "Concentric",
  "entities": ["jaw_left_pivot_point", "jaw_right_pivot_point"],
  "weight": 1.0
}
```

### Use Case 3: Horizontal Base

**Goal:** Keep base platform level

**SolidWorks Setup:**
1. Create datum plane on top of base: `base_top_plane`
2. In assembly, constrain parallel to world XY plane

**Descriptor:**
```json
{
  "id": "level_base",
  "type": "Horizontal",
  "entities": ["base_top_plane"],
  "weight": 0.5
}
```

### Use Case 4: Perpendicular Linkages

**Goal:** Keep linkage arm perpendicular to base

**SolidWorks Setup:**
1. Create datum axis along linkage: `linkage_axis`
2. Create datum plane on base: `base_reference_plane`
3. Add perpendicular constraint in assembly

**Descriptor:**
```json
{
  "id": "perpendicular_linkage",
  "type": "Perpendicular",
  "entities": ["linkage_axis", "base_reference_plane"],
  "weight": 1.0
}
```

### Use Case 5: Collinear Rotation Axes

**Goal:** Multiple joints rotate about same axis

**SolidWorks Setup:**
1. Create datum axis on first joint: `joint1_axis`
2. Create datum axis on second joint: `joint2_axis`
3. Add collinear constraint in assembly

**Descriptor:**
```json
{
  "id": "aligned_axes",
  "type": "Collinear",
  "entities": ["joint1_axis", "joint2_axis"],
  "weight": 1.0
}
```

---

## Part 9: Troubleshooting

### Problem: Datum elements don't appear in GLB

**Solution:**
- Check export options: "Include Reference Geometry" enabled
- Verify datums are visible in SolidWorks (not hidden)
- Try exporting with "Export all objects" option
- Some SolidWorks versions may not export reference geometry → Create actual geometry proxies instead

**Workaround:**
- Create small sphere/cube at datum point location
- Name the geometry node (e.g., `jaw_left_pivot_point_marker`)
- Export geometry, use in constraints

### Problem: Datum names don't match in GLB

**Solution:**
- SolidWorks may modify names during export
- Check actual names in GLB viewer
- Update descriptor to match exported names
- Avoid special characters and spaces

### Problem: Too many nodes in GLB

**Solution:**
- Hide/suppress unnecessary construction geometry before export
- Only export parts and named datums needed for simulation
- Use assembly configurations to control visibility

### Problem: Constraints not working on datums

**Solution:**
- Verify datum names exactly match between GLB and descriptor
- Check browser console for "Entity not found" warnings
- Datums may be inside part hierarchy → Use full path or flatten

---

## Part 10: Advanced Techniques

### Technique 1: Hidden Datum Markers

Create small, invisible geometry to mark datum locations:

1. Create tiny sphere (0.1mm radius) at datum location
2. Apply transparent material
3. Name appropriately: `jaw_pivot_marker`
4. Export with model
5. In descriptor, reference marker name

### Technique 2: Assembly-Level Master Datums

Create master reference datums at assembly level:

1. Assembly → Insert → Reference Geometry
2. Create planes/points/axes at key locations
3. Name with `assembly_` prefix
4. Constrain parts to these master datums
5. Master datums export as root-level nodes in GLB

### Technique 3: Datum Coordinate Systems

Create full coordinate systems (3 planes + origin):

1. Insert → Reference Geometry → Coordinate System
2. Define origin and axes
3. Name: `jaw_left_frame`
4. Exports as transformation matrix in GLB
5. Use for complex kinematic chains

---

## Part 11: Quick Reference

### Datum Element Cheat Sheet

| Element Type | Command Path | Best For | Example Name |
|--------------|--------------|----------|--------------|
| **Plane** | Insert → Reference Geometry → Plane | Parallel, perpendicular, horizontal constraints | `jaw_left_plane` |
| **Point** | Insert → Reference Geometry → Point | Concentric, coincident constraints | `pivot_point` |
| **Axis** | Insert → Reference Geometry → Axis | Collinear, rotation constraints | `rotation_axis` |
| **Coordinate System** | Insert → Reference Geometry → Coordinate System | Full kinematic frames | `jaw_frame` |

### Constraint Type → Datum Recommendations

| Constraint Type | Recommended Datum | Why |
|-----------------|-------------------|-----|
| Parallel | Planes | Planes have orientation |
| Perpendicular | Planes or Axes | Need directional elements |
| Horizontal | Planes | Horizontal = parallel to XZ plane |
| Vertical | Planes or Axes | Vertical = parallel to Y axis |
| Collinear | Points or Axes | Need elements on same line |
| Concentric | Points | Share same center |
| Coincident | Points | Same location |
| Tangent | Planes (at contact) | Touch without intersection |
| Equal | N/A | Works on geometry directly |

---

## Summary

**Hybrid Approach = Best of Both Worlds**

✅ **Current system works as-is** - no code changes needed  
✅ **Use datum planes/points** for precise constraints  
✅ **Matches SolidWorks workflow** - export reference geometry  
✅ **Flexible naming** - descriptive names become node IDs  
✅ **Compatible with GLB export** - datums export as nodes  

**Workflow:**
1. Design parts in SolidWorks
2. Create and name datum planes/points/axes
3. Export assembly as GLB (include reference geometry)
4. Create descriptor referencing datum names
5. Upload GLB + descriptor to simulator
6. Constraints enforced on precise datum locations!

**The simulator already supports this - just use meaningful names for your datum elements!** 🎯
