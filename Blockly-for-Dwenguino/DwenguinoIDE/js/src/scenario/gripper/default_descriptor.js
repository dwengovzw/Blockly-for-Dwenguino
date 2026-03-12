/**
 * Default kinematics descriptor that maps servo angles to 3D model joint rotations.
 * This descriptor defines:
 * - Model properties (scale, axis orientation)
 * - Part definitions with reference geometry (points, planes) in local coordinates
 * - Joint definitions with their rotation axes, angle ranges, and servo mappings
 * - Constraints between parts using reference geometry (e.g. keep grip faces parallel)
 * 
 * The descriptor allows for extensibility - users can upload custom JSON files
 * to define different gripper configurations, servo mappings, and mechanical constraints.
 * Reference points/planes are defined in local coordinates relative to each part.
 */
const DEFAULT_KINEMATICS_DESCRIPTOR = {
    version: 1,
    model: {
        upAxis: "Y"
    },
    parts: [
        {
            name: "jaw_left",
            referencePoints: {
                pivot: { x: -30, y: 20, z: 0 },
                gripPoint: { x: -55, y: 20, z: 0 }
            },
            referencePlanes: {}
        },
        {
            name: "jaw_right",
            referencePoints: {
                pivot: { x: 30, y: 20, z: 0 },
                gripPoint: { x: 55, y: 20, z: 0 }
            },
            referencePlanes: {}
        },
        {
            name: "base",
            referencePoints: {},
            referencePlanes: {}
        }
    ],
    joints: [
        {
            name: "jaw_left",
            node: "jaw_left",
            type: "revolute",
            axis: [0, 0, -1],
            axisPoint: "pivot",
            minDeg: 0,
            maxDeg: 180,
            servo: {
                index: 1,
                min: 180,
                max: 0,
                invert: false
            }
        },
        {
            name: "jaw_right",
            node: "jaw_right",
            type: "revolute",
            axis: [0, 0, 1],
            axisPoint: "pivot",
            minDeg: 0,
            maxDeg: 180,
            servo: {
                index: 2,
                min: 0,
                max: 180,
                invert: true
            }
        }
    ],
    constraints: [],
    constraintSolver: {
        maxIterations: 10,
        convergenceThreshold: 0.001,
        enableConflictDetection: true,
        showReferencePoints: false,
        referencePointScale: 1.0
    }
};

export default DEFAULT_KINEMATICS_DESCRIPTOR;
