# Kinematics Descriptor Guide

Complete guide to creating kinematics descriptors for the Dwenguino Gripper Simulator. A kinematics descriptor is a JSON file that defines how servo angles map to 3D joint rotations, with support for complex mechanical constraints.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Model Section](#model-section)
4. [Parts Section](#parts-section)
5. [Joints Section](#joints-section)
6. [Constraints Section](#constraints-section)
7. [Constraint Solver Configuration](#constraint-solver-configuration)
8. [Complete Examples](#complete-examples)
9. [Tips & Troubleshooting](#tips--troubleshooting)

---

## Overview

A kinematics descriptor defines:
- **Model properties** (scale, coordinate system orientation)
- **Part definitions** with reference geometry (points, planes) in local coordinates
- **Joints** mapping servo angles to 3D rotations
- **Constraints** enforcing mechanical relationships (hinges, parallel surfaces, fixed points)
- **Solver settings** for constraint convergence

The descriptor works with a GLB/GLTF 3D model where each part is a named node in the scene graph.

---

## File Structure

```json
{
  "version": 1,
  "model": { ... },
  "parts": [ ... ],
  "joints": [ ... ],
  "constraints": [ ... ],
  "constraintSolver": { ... }
}
```

---

## Model Section

Defines global model properties.

```json
"model": {
  "upAxis": "Y"
}
```

### Properties

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `upAxis` | string | "Y" | World up axis: "Y" (Three.js default) or "Z" (SolidWorks/CAD convention). If "Z", model rotates -90° around X. |

### Examples

```json
"model": {
  "upAxis": "Y"
}
```

```json
"model": {
  "upAxis": "Z"
}
```

---

## Parts Section

Defines structural parts with reference geometry (points, planes) used by constraints.

```json
"parts": [
  {
    "name": "jaw_left",
    "referencePoints": {
      "pivot": { "x": -30, "y": 20, "z": 0 },
      "gripPoint": { "x": -55, "y": 20, "z": 0 }
    },
    "referencePlanes": {
      "gripFace": { "normal": [0, 1, 0], "point": [-55, 20, 0] }
    }
  }
]
```

### Part Definition

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | string | **YES** | Must match a node name in the GLB model. Used to look up the 3D mesh. |
| `referencePoints` | object | no | Named points in local (part-relative) coordinates. |
| `referencePlanes` | object | no | Named planes in local coordinates. |

### Reference Points

Points are defined in **local coordinates** (relative to the part's own frame).

```json
"referencePoints": {
  "pivot": { "x": 0, "y": 0, "z": 0 },
  "gripPoint": { "x": -55, "y": 20, "z": 0 }
}
```

- **x, y, z**: Local coordinates in world units
- Automatically transformed to world space during constraint solving
- Used by constraints to measure/enforce positions

### Reference Planes

Planes are defined with a normal vector and a point, both in **local coordinates**.

```json
"referencePlanes": {
  "gripFace": {
    "normal": [0, 1, 0],
    "point": [0, 0, 0]
  },
  "side_front": {
    "normal": [0, 0, 1],
    "point": [0, 0, 0]
  }
}
```

- **normal**: [x, y, z] vector (3-element array, will be normalized)
- **point**: [x, y, z] point on the plane (3-element array)
- Automatically transformed to world space during constraint solving
- Used to measure/enforce orientations (parallel, perpendicular, etc.)

### Example

```json
"parts": [
  {
    "name": "arm-1",
    "referencePoints": {
      "pivot_left": { "x": -0.05, "y": 0, "z": 0 },
      "pivot_right": { "x": 0, "y": 0, "z": 0 }
    },
    "referencePlanes": {
      "side_front": { "normal": [0, 0, 1], "point": [0, 0, 0] },
      "side_back": { "normal": [0, 0, 1], "point": [0, 0, -0.005] }
    }
  },
  {
    "name": "arm-2",
    "referencePoints": {
      "pivot_right": { "x": 0, "y": 0, "z": 0 }
    },
    "referencePlanes": {
      "side_front": { "normal": [0, 0, 1], "point": [0, 0, 0] }
    }
  }
]
```

---

## Joints Section

Defines how servo angles map to 3D joint rotations.

```json
"joints": [
  {
    "name": "jaw_left",
    "node": "jaw_left",
    "type": "revolute",
    "axis": [0, 0, -1],
    "axisPoint": "pivot",
    "minDeg": 0,
    "maxDeg": 180,
    "servo": {
      "index": 1,
      "min": 180,
      "max": 0,
      "invert": false
    }
  }
]
```

### Joint Definition

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | string | **YES** | Joint identifier (for logging). |
| `node` | string | **YES** | Name of the 3D node to animate (must match GLB node name). |
| `type` | string | **YES** | "revolute" (rotation) or "prismatic" (not yet supported). |
| `axis` | [x, y, z] | **YES** | Rotation axis in local coordinates. Will be normalized. |
| `axisPoint` | string or object | **YES** | Where rotation axis passes through. |
| `minDeg` | number | **YES** | Minimum joint angle in degrees. |
| `maxDeg` | number | **YES** | Maximum joint angle in degrees. |
| `servo` | object | **YES** | Servo mapping and range. |

### Axis Point

Specifies where the rotation axis passes through. Can be:

**String reference to a point:**
```json
"axisPoint": "pivot"
```
The rotation axis passes through the reference point named "pivot" on this part.

**Explicit local coordinates:**
```json
"axisPoint": { "x": 0, "y": 0, "z": 0 }
```
The rotation axis passes through this point in local coordinates.

The part rotates around this point, not its origin. Essential for realistic gripper motion.

### Servo Mapping

Maps a servo index and its range to joint angle range using linear interpolation.

```json
"servo": {
  "index": 1,
  "min": 180,
  "max": 0,
  "invert": false
}
```

| Key | Type | Description |
|-----|------|-------------|
| `index` | number | Servo index (0-based or 1-based depending on hardware). |
| `min` | number | Servo PWM value (0–180) for joint min angle. |
| `max` | number | Servo PWM value (0–180) for joint max angle. |
| `invert` | boolean | If true, reverses the servo range. |

**How it works:**

```
jointAngle = minDeg + (servoPWM - servoMin) / (servoMax - servoMin) * (maxDeg - minDeg)
```

If `servo.min > servo.max`, the mapping is reversed (increasing PWM decreases angle).

### Example

```json
"joints": [
  {
    "name": "jaw_left",
    "node": "jaw_left",
    "type": "revolute",
    "axis": [0, 0, -1],
    "axisPoint": "pivot",
    "minDeg": 0,
    "maxDeg": 180,
    "servo": {
      "index": 1,
      "min": 180,
      "max": 0,
      "invert": false
    }
  },
  {
    "name": "arm_main",
    "node": "arm-1",
    "type": "revolute",
    "axis": [0, 0, 1],
    "axisPoint": "pivot_left",
    "minDeg": 0,
    "maxDeg": 90,
    "servo": {
      "index": 2,
      "min": 45,
      "max": 135,
      "invert": false
    }
  }
]
```

---

## Constraints Section

Defines mechanical relationships between parts. The iterative constraint solver enforces these by applying corrective twists (translation + rotation).

```json
"constraints": [
  {
    "id": "hinge_joint",
    "type": "PointPointCoincident",
    "entities": [
      { "name": "arm-1", "referencePoint": "pivot_right", "weight": 0.5 },
      { "name": "arm-2", "referencePoint": "pivot_right", "weight": 0.5 }
    ],
    "weight": 1.0,
    "description": "Keep arms connected at pivot"
  }
]
```

### Constraint Definition

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `id` | string | no | Unique identifier for logging/debugging. |
| `type` | string | **YES** | Constraint type (see below). |
| `entities` | array | **YES** | Parts involved in constraint. |
| `weight` | number | no | Global constraint priority/stiffness (0–1, default 1.0). |
| `value` | object | no | Type-specific parameters (plane normal, offset, etc.). |
| `description` | string | no | Human-readable description. |

### Entity Definition

```json
{
  "name": "arm-1",
  "referencePoint": "pivot_right",
  "referencePlane": "side_front",
  "entityWeight": 0.5
}
```

| Key | Type | Description |
|-----|------|-------------|
| `name` | string | **REQUIRED** Part name (must match a part in the descriptor). |
| `referencePoint` | string | Reference point name for position measurement. |
| `referencePlane` | string | Reference plane name for orientation measurement. |
| `entityWeight` | number | Per-entity weight (0–1, default 1.0). Controls how much this part moves. |

### Entity Weights

Controls how displacement is distributed between parts:

- **1.0**: Full enforcement on this part (other parts fixed)
- **0.0**: No enforcement (other parts move to satisfy constraint)
- **0.5**: Symmetric (both parts move equally)
- Weights are normalized (e.g., [0.5, 0.5] → each gets 50%)

### Constraint Types

#### POINTPOINTCOINCIDENT

Forces two points to coincide (3 translational DOF).

```json
{
  "id": "hinge_center",
  "type": "PointPointCoincident",
  "entities": [
    { "name": "arm-1", "referencePoint": "pivot_right", "entityWeight": 0 },
    { "name": "arm-2", "referencePoint": "pivot_right", "entityWeight": 1 }
  ],
  "weight": 1.0,
  "description": "Keep pivot points aligned"
}
```

The first entity's reference point is the target. All other entities move to match it.

#### POINTPLANE

Forces a point to lie on a plane (1 translational DOF).

```json
{
  "id": "grip_surface_contact",
  "type": "PointPlane",
  "entities": [
    { "name": "jaw_left", "referencePoint": "gripPoint" },
    { "name": "object", "referencePlane": "top_surface" }
  ],
  "weight": 1.0,
  "description": "Grip point stays on surface"
}
```

The first entity's reference point is forced onto the second entity's reference plane.

#### PLANEPARALLEL

Forces two planes to be parallel (1 rotational DOF + optional 1 translational).

```json
{
  "id": "grip_faces_aligned",
  "type": "PLANEPARALLEL",
  "entities": [
    { "name": "jaw_left", "referencePlane": "gripFace", "entityWeight": 0 },
    { "name": "jaw_right", "referencePlane": "gripFace", "entityWeight": 1 }
  ],
  "value": { "coincident": false },
  "weight": 1.0,
  "description": "Keep grip surfaces parallel"
}
```

| `value` key | Type | Description |
|-------------|------|-------------|
| `coincident` | bool | If true, planes are also coincident (3 DOF). Default false. |

#### HORIZONTAL

Forces a plane/edge to be horizontal (parallel to XZ plane).

```json
{
  "id": "base_level",
  "type": "Horizontal",
  "entities": [
    { "name": "base" }
  ],
  "weight": 0.5,
  "description": "Keep base horizontal"
}
```

#### VERTICAL

Forces a plane/edge to be vertical (parallel to Y-axis).

```json
{
  "id": "wall_perpendicular",
  "type": "Vertical",
  "entities": [
    { "name": "arm-1" }
  ],
  "weight": 0.5,
  "description": "Keep arm vertical"
}
```

#### FIXED

Fixes a part in place (position + orientation).

```json
{
  "id": "base_fixed",
  "type": "FIXED",
  "entities": [
    { "name": "base", "entityWeight": 1.0 }
  ],
  "weight": 1.0,
  "description": "Fix base completely"
}
```

All parts with weight > 0 are fixed at their current transform.

#### FIXEDJOINT

Fixes a pivot point in place, optionally allows rotation around a plane normal.

```json
{
  "id": "gripper_pivot",
  "type": "FIXEDJOINT",
  "entities": [
    { "name": "gripper_root", "referencePoint": "pivot_center" }
  ],
  "value": {
    "planeNormal": [0, 0, 1]
  },
  "weight": 1.0,
  "description": "Fix pivot point, allow rotation in XY plane"
}
```

| `value` key | Type | Description |
|-------------|------|-------------|
| `planeNormal` | [x, y, z] | Allows rotation about this normal. Omit to fully fix. |

#### JOINT

Hinge joint: two parts rotate in a plane while pivot points remain coincident (5 DOF constrained).

```json
{
  "id": "arm_hinge",
  "type": "Joint",
  "entities": [
    { "name": "arm-1", "referencePoint": "pivot_right", "referencePlane": "side_front", "entityWeight": 0.5 },
    { "name": "arm-2", "referencePoint": "pivot_left", "referencePlane": "side_front", "entityWeight": 0.5 }
  ],
  "value": {
    "planeNormal": [0, 0, 1],
    "coincident": true,
    "offset": 0.0
  },
  "weight": 1.0,
  "description": "Revolute hinge joint"
}
```

| `value` key | Type | Description |
|-------------|------|-------------|
| `planeNormal` | [x, y, z] | Normal to the rotation plane (required). |
| `coincident` | bool | If true, pivot points must coincide (default true). |
| `offset` | number | Distance between pivot points along plane normal. Use for gearbox spacing. |

---

## Constraint Solver Configuration

Controls the iterative constraint solver behavior.

```json
"constraintSolver": {
  "maxIterations": 50,
  "convergenceThreshold": 0.001,
  "enableConflictDetection": true,
  "instantMotion": true,
  "gainScale": 2.0,
  "translationWeight": 1.0,
  "rotationWeight": 1.0,
  "maxLinearStep": 0.0,
  "maxAngularStep": 0.0
}
```

### Properties

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `maxIterations` | number | 10 | Maximum solver iterations per frame (50 if `instantMotion=true`). Higher = slower but more accurate. |
| `convergenceThreshold` | number | 0.001 | Error tolerance in world units and radians. Lower = more precise. |
| `enableConflictDetection` | bool | true | Warn about conflicting constraints (e.g., horizontal + vertical). |
| `instantMotion` | bool | true | Skip servo smoothing; snap to target immediately. |
| `gainScale` | number | 1.0 (2.0 if instant) | Global multiplier on solver gains. 2–4 for faster convergence. |
| `translationWeight` | number | 1.0 | Multiplier on translation gains. Lower values (0.5–1.0) bias toward rotation. |
| `rotationWeight` | number | 1.0 | Multiplier on rotation gains. Higher values (1.0–3.0) favor rotation over translation. |
| `maxLinearStep` | number | 0.0 | Max translation per iteration (world units). 0 = unlimited. Use to prevent instability at high gains. |
| `maxAngularStep` | number | 0.0 | Max rotation per iteration (radians). 0 = unlimited. Typically 0.05–0.15 rad (~3–9°). |

### Tuning Guide

**Slow convergence?**
- Increase `maxIterations` (e.g., 100–1000)
- Increase `gainScale` (e.g., 2.0–4.0)
- Increase `rotationWeight` if rotation is the bottleneck (e.g., 2.0–3.0)

**Parts going crazy/unstable?**
- Add `maxLinearStep` and `maxAngularStep` to clamp motion
- Lower `gainScale` (e.g., 0.5–1.0)
- Lower `convergenceThreshold` (tighter tolerance = more iterations needed)

**Motion too slow?**
- Set `instantMotion: true`
- Increase `gainScale` and `rotationWeight`
- Lower `convergenceThreshold`

**Rotation-heavy model?**
- Set `translationWeight: 0.5` and `rotationWeight: 2.0–3.0`
- This biases the solver toward rotation over translation

---

## Complete Examples

### Example 1: Simple Gripper

```json
{
  "version": 1,
  "model": {
    "upAxis": "Y",
    "scale": 1
  },
  "parts": [
    {
      "name": "base",
      "referencePoints": {},
      "referencePlanes": {}
    },
    {
      "name": "jaw_left",
      "referencePoints": {
        "pivot": { "x": -30, "y": 20, "z": 0 },
        "gripPoint": { "x": -55, "y": 20, "z": 0 }
      },
      "referencePlanes": {
        "gripFace": { "normal": [1, 0, 0], "point": [-55, 20, 0] }
      }
    },
    {
      "name": "jaw_right",
      "referencePoints": {
        "pivot": { "x": 30, "y": 20, "z": 0 },
        "gripPoint": { "x": 55, "y": 20, "z": 0 }
      },
      "referencePlanes": {
        "gripFace": { "normal": [-1, 0, 0], "point": [55, 20, 0] }
      }
    }
  ],
  "joints": [
    {
      "name": "jaw_left",
      "node": "jaw_left",
      "type": "revolute",
      "axis": [0, 0, -1],
      "axisPoint": "pivot",
      "minDeg": 0,
      "maxDeg": 180,
      "servo": {
        "index": 1,
        "min": 180,
        "max": 0,
        "invert": false
      }
    },
    {
      "name": "jaw_right",
      "node": "jaw_right",
      "type": "revolute",
      "axis": [0, 0, 1],
      "axisPoint": "pivot",
      "minDeg": 0,
      "maxDeg": 180,
      "servo": {
        "index": 2,
        "min": 0,
        "max": 180,
        "invert": false
      }
    }
  ],
  "constraints": [
    {
      "id": "grip_faces_parallel",
      "type": "PLANEPARALLEL",
      "entities": [
        { "name": "jaw_left", "referencePlane": "gripFace", "entityWeight": 0.5 },
        { "name": "jaw_right", "referencePlane": "gripFace", "entityWeight": 0.5 }
      ],
      "weight": 1.0,
      "description": "Keep grip faces parallel"
    }
  ],
  "constraintSolver": {
    "maxIterations": 50,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true,
    "instantMotion": true,
    "gainScale": 2.0,
    "translationWeight": 1.0,
    "rotationWeight": 1.0
  }
}
```

### Example 2: Multi-Arm with Rotation-Heavy Constraints

```json
{
  "version": 1,
  "model": {
    "upAxis": "Y",
    "scale": 0.001
  },
  "parts": [
    {
      "name": "arm-1",
      "referencePoints": {
        "pivot_left": { "x": -50, "y": 0, "z": 0 },
        "pivot_right": { "x": 0, "y": 0, "z": 0 }
      },
      "referencePlanes": {
        "side_front": { "normal": [0, 0, 1], "point": [0, 0, 0] },
        "side_back": { "normal": [0, 0, 1], "point": [0, 0, -5] }
      }
    },
    {
      "name": "arm-2",
      "referencePoints": {
        "pivot_left": { "x": -50, "y": 0, "z": 0 },
        "pivot_right": { "x": 0, "y": 0, "z": 0 }
      },
      "referencePlanes": {
        "side_front": { "normal": [0, 0, 1], "point": [0, 0, 0] },
        "side_back": { "normal": [0, 0, 1], "point": [0, 0, -5] }
      }
    },
    {
      "name": "lever",
      "referencePoints": {
        "pivot": { "x": -65, "y": 0, "z": 0 }
      },
      "referencePlanes": {
        "side_front": { "normal": [0, 0, 1], "point": [0, 0, 0] }
      }
    }
  ],
  "joints": [
    {
      "name": "arm-1",
      "node": "arm-1",
      "type": "revolute",
      "axis": [0, 0, 1],
      "axisPoint": "pivot_left",
      "minDeg": 0,
      "maxDeg": 180,
      "servo": {
        "index": 1,
        "min": 0,
        "max": 180,
        "invert": false
      }
    }
  ],
  "constraints": [
    {
      "id": "arm_hinge",
      "type": "Joint",
      "entities": [
        { "name": "arm-1", "referencePoint": "pivot_right", "referencePlane": "side_front", "entityWeight": 0.5 },
        { "name": "arm-2", "referencePoint": "pivot_left", "referencePlane": "side_front", "entityWeight": 0.5 }
      ],
      "value": {
        "planeNormal": [0, 0, 1],
        "coincident": true,
        "offset": 0.0
      },
      "weight": 1.0,
      "description": "Revolute hinge"
    },
    {
      "id": "arms_aligned",
      "type": "PLANEPARALLEL",
      "entities": [
        { "name": "arm-1", "referencePlane": "side_back", "entityWeight": 0.5 },
        { "name": "arm-2", "referencePlane": "side_front", "entityWeight": 0.5 }
      ],
      "weight": 1.0,
      "description": "Keep arms parallel"
    },
    {
      "id": "lever_fixed",
      "type": "FIXEDJOINT",
      "entities": [
        { "name": "lever", "referencePoint": "pivot" }
      ],
      "weight": 1.0,
      "description": "Fix lever pivot"
    }
  ],
  "constraintSolver": {
    "maxIterations": 200,
    "convergenceThreshold": 0.001,
    "enableConflictDetection": true,
    "instantMotion": false,
    "gainScale": 1.5,
    "translationWeight": 0.5,
    "rotationWeight": 2.0,
    "maxLinearStep": 0.1,
    "maxAngularStep": 0.1
  }
}
```

---

## Tips & Troubleshooting

### General Tips

1. **Start simple**: Build with one or two constraints, then add more.
2. **Test reference geometry**: Use the console (F12) to verify reference point/plane transforms.
3. **Use descriptive names**: Makes debugging easier when things go wrong.
4. **Scale your model**: If your GLB is in mm, set `model.scale: 0.001` to convert to meters.

### Problem: Constraints not working

**Check:**
1. Part names match GLB node names exactly (case-sensitive)
2. Reference point/plane names match descriptor
3. Entity names are spelled correctly
4. Constraint type is valid

**Verify in browser console:**
```
[Gripper Constraints] Initialized X constraints with iterative solver
```

### Problem: Slow convergence

1. Increase `maxIterations` (e.g., 100–1000)
2. Increase `gainScale` (e.g., 2.0–3.0)
3. For rotation-heavy models: increase `rotationWeight` (e.g., 2.0–3.0)
4. Lower `convergenceThreshold` (e.g., 0.005)

**Never** start with high `gainScale` + high iterations. Tune incrementally.

### Problem: Parts wiggle or oscillate

1. Lower `gainScale` (e.g., 0.5–1.0)
2. Add `maxLinearStep` and `maxAngularStep` to clamp motion
3. Lower `rotationWeight` to reduce angular overshoot

### Problem: Constraints not satisfied

1. Check for conflicting constraints (horizontal + vertical on same part)
2. Verify entity weights distribute properly (sum shouldn't exceed total mass)
3. Increase `maxIterations` and `gainScale` significantly
4. Check if constraint is physically possible (e.g., can't fix two parts rigidly if they need to rotate relative to each other)

### Problem: Only translation, no rotation (or vice versa)

Use `translationWeight` and `rotationWeight` to balance:

- **Too much translation**: Set `translationWeight: 0.5` and `rotationWeight: 2.0`
- **Too much rotation**: Set `translationWeight: 2.0` and `rotationWeight: 0.5`

### Example: Debugging Output

Look for these messages in the browser console:

```
[Gripper] DRACOLoader configured for compressed GLB files
[Gripper] Model loaded: { center: {...}, size: {...} }
[Gripper Constraints] Initialized 5 constraints with iterative solver (max 50 iterations)
[Gripper Constraints] Converged in 12 iterations (delta: 0.000234, error: 0.000102)
```

If you see:

```
[Gripper Constraints] Did not converge after 50 iterations (may have conflicting constraints)
```

Your constraints are fighting each other or too many iterations needed.

---

## References

- **Three.js Coordinate System**: Y is up, X is right, Z is toward camera
- **Quaternions**: Used for smooth rotations; angles in radians for angular properties
- **Twist Motion**: Combination of translation (Δv) and rotation (Δω) applied to bodies
- **Constraint Solving**: Iterative solver using per-entity weights to distribute forces/torques

---

## Quick Start Checklist

1. ✓ Export GLB from CAD with named nodes for each part
2. ✓ Define `parts` with reference points/planes in local coordinates
3. ✓ Define `joints` mapping servos to rotations
4. ✓ Define `constraints` for mechanical relationships
5. ✓ Tune `constraintSolver` if convergence is slow
6. ✓ Test in simulator, iterate on descriptor
7. ✓ Use `maxLinearStep`/`maxAngularStep` if parts oscillate

---

**Happy building! For issues, check the browser console (F12) for detailed constraint solver logs.**
