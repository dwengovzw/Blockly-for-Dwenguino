import * as THREE from "three";
import { createVirtualPlaneEntity } from "../utils.js";
import { applyPlanePlaneParallel } from "./PlanePlaneParallelConstraint.js";

/**
 * Vertical Constraint: Forces an edge or plane normal to be vertical (parallel to Y-axis).
 * Composites on PlanePlaneParallel with a virtual vertical reference plane.
 *
 * @param {Object} constraint - Constraint definition
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyVertical(constraint, refGeometry, config) {
    if (constraint.entities.length < 1) return;
    const weight = constraint.weight ?? 1.0;

    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
    const measureQuat = new THREE.Quaternion();
    measureNode.getWorldQuaternion(measureQuat);
    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat).normalize();
    const verticalNormal = new THREE.Vector3(0, Math.sign(worldNormal.y) || 1, 0);

    const virtualPlane = createVirtualPlaneEntity(verticalNormal, new THREE.Vector3());
    const parallelConstraint = {
        type: 'PlanePlaneParallel',
        entities: [virtualPlane, constraint.entities[0]],
        weight: weight
    };

    applyPlanePlaneParallel(parallelConstraint, refGeometry, config);
}

/**
 * Compute error for Vertical constraint.
 * @param {Object} constraint
 * @returns {number} Error magnitude
 */
export function computeVerticalError(constraint) {
    if (constraint.entities.length < 1) return 0;
    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
    const measureQuat = new THREE.Quaternion();
    measureNode.getWorldQuaternion(measureQuat);
    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat).normalize();
    const verticalNormal = new THREE.Vector3(0, Math.sign(worldNormal.y) || 1, 0);
    return worldNormal.angleTo(verticalNormal);
}
