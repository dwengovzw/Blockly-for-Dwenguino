/**
 * EXAMPLE: Per-Entity Weights in Constraint Descriptors
 * 
 * This example demonstrates how to use per-entity weights to control
 * the displacement distribution when constraints are satisfied.
 */

// Example 1: SYMMETRIC CONSTRAINT (both parts move equally)
// Use case: Hinge joint connecting two parts
{
  "id": "symmetric_hinge",
  "type": "PointPointCoincident",
  "entities": [
    { "name": "part-left", "referencePoint": "pivot", "weight": 0.5 },
    { "name": "part-right", "referencePoint": "pivot", "weight": 0.5 }
  ],
  "weight": 1.0,
  "description": "Hinge - both parts move equally to meet at pivot"
}

// Example 2: ASYMMETRIC CONSTRAINT (weighted distribution)
// Use case: Linkage where one part should move more than the other
{
  "id": "driven_linkage",
  "type": "PointPointCoincident",
  "entities": [
    { "name": "input-arm", "referencePoint": "pivot", "weight": 0.7 },
    { "name": "output-arm", "referencePoint": "pivot", "weight": 0.3 }
  ],
  "weight": 0.9,
  "description": "Input arm moves more (70%) than output arm (30%)"
}

// Example 3: FIXED CONSTRAINT (one part stays fixed)
// Use case: One part is constrained to stay in place, other moves
{
  "id": "fixed_base",
  "type": "PointPointCoincident",
  "entities": [
    { "name": "base-frame", "referencePoint": "anchor", "weight": 1.0 },
    { "name": "movable-part", "referencePoint": "connection", "weight": 0.0 }
  ],
  "weight": 1.0,
  "description": "Base frame stays fixed, movable part moves to meet it"
}

// Example 4: PLANE-PLANE PARALLEL with weights
// Use case: Keep surfaces parallel but allow asymmetric rotation
{
  "id": "gripper_parallel_faces",
  "type": "PlanePlaneParallel",
  "entities": [
    { "name": "left-jaw", "referencePlane": "grip_face", "weight": 0.6 },
    { "name": "right-jaw", "referencePlane": "grip_face", "weight": 0.4 }
  ],
  "weight": 1.0,
  "description": "Keep jaws parallel - left jaw rotates more (60%) than right (40%)"
}

// Example 5: POINT-PLANE constraint with weights
// Use case: Asymmetric point-to-plane constraint
{
  "id": "asymmetric_point_plane",
  "type": "PointPlane",
  "entities": [
    { "name": "moving-point", "referencePoint": "contact", "weight": 0.3 },
    { "name": "reference-plane", "referencePlane": "surface", "weight": 0.7 }
  ],
  "weight": 1.0,
  "description": "Point moves 30%, plane moves 70% to meet constraint"
}

// Example 6: COMPLETE GRIPPER MECHANISM
// Demonstrates mixed symmetric and asymmetric constraints
{
  "version": 1,
  "model": { "upAxis": "Y", "scale": 1 },
  "parts": [
    { "name": "base", "referencePoints": {}, "referencePlanes": {} },
    { "name": "left-jaw", "referencePoints": { "pivot": { "x": 0, "y": 0, "z": 0 } } },
    { "name": "right-jaw", "referencePoints": { "pivot": { "x": 0, "y": 0, "z": 0 } } }
  ],
  "constraints": [
    {
      "id": "left_jaw_hinge",
      "type": "PointPointCoincident",
      "entities": [
        { "name": "base", "referencePoint": "pivot", "weight": 1.0 },
        { "name": "left-jaw", "referencePoint": "pivot", "weight": 0.0 }
      ],
      "weight": 1.0,
      "description": "Fix left jaw pivot to base"
    },
    {
      "id": "right_jaw_hinge",
      "type": "PointPointCoincident",
      "entities": [
        { "name": "base", "referencePoint": "pivot", "weight": 1.0 },
        { "name": "right-jaw", "referencePoint": "pivot", "weight": 0.0 }
      ],
      "weight": 1.0,
      "description": "Fix right jaw pivot to base"
    },
    {
      "id": "jaw_symmetry",
      "type": "PlanePlaneParallel",
      "entities": [
        { "name": "left-jaw", "referencePlane": "grip_face", "weight": 0.5 },
        { "name": "right-jaw", "referencePlane": "grip_face", "weight": 0.5 }
      ],
      "weight": 0.8,
      "description": "Keep grip faces parallel - symmetric rotation"
    }
  ]
}

// WEIGHT VALUE GUIDE:
// 
// weight: 0.0 = This entity does not move (full enforcement on other entities)
// weight: 0.25 = This entity moves 1/4 of the needed correction
// weight: 0.5 = This entity moves 1/2 of the needed correction (symmetric with equal partner)
// weight: 0.75 = This entity moves 3/4 of the needed correction
// weight: 1.0 = This entity moves all of the needed correction (others stay fixed)
//
// Important: Weights are automatically NORMALIZED
// So [weight: 1.0, weight: 1.0] becomes [0.5, 0.5]
// And [weight: 1.0, weight: 2.0] becomes [0.333, 0.667]
// And [weight: 0.7, weight: 0.3] becomes [0.7, 0.3] (already sum to 1.0)

// COMMON PATTERNS:
//
// 1. FIXED POINT:
//    weight: 1.0, weight: 0.0
//    Result: First entity stays fixed, second moves to it
//
// 2. SYMMETRIC JOINT:
//    weight: 0.5, weight: 0.5
//    Result: Both entities move equally toward middle
//
// 3. MASTER-SLAVE:
//    weight: 0.8, weight: 0.2
//    Result: Master moves more, slave follows
//
// 4. THREE-PART EQUAL:
//    weight: 1.0, weight: 1.0, weight: 1.0
//    Result: All three move equally (normalized to 0.333 each)
//
// 5. THREE-PART WEIGHTED:
//    weight: 1.0, weight: 2.0, weight: 3.0
//    Result: Third part moves most (0.5), second (0.333), first (0.167)
