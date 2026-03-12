import * as THREE from "three";
import { createVirtualPlaneEntity } from "../utils.js";
import { applyPlanePlaneParallel } from "./PlanePlaneParallelConstraint.js";

/**
 * Horizontal Constraint: Forces an edge or plane normal to be horizontal (parallel to XZ plane).
 * Composites on PlanePlaneParallel with a virtual horizontal reference plane.
 *
 * @param {Object} constraint - Constraint definition
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyHorizontal(constraint, refGeometry, config) {
    if (constraint.entities.length < 1) return;
    const weight = constraint.weight ?? 1.0;

    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
    const measureQuat = new THREE.Quaternion();
    measureNode.getWorldQuaternion(measureQuat);
    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat);
    const horizontalNormal = new THREE.Vector3(worldNormal.x, 0, worldNormal.z);

    if (horizontalNormal.lengthSq() < 1e-8) return;
    horizontalNormal.normalize();

    const virtualPlane = createVirtualPlaneEntity(horizontalNormal, new THREE.Vector3());
    const parallelConstraint = {
        type: 'PlanePlaneParallel',
        entities: [virtualPlane, constraint.entities[0]],
        weight: weight
    };

    applyPlanePlaneParallel(parallelConstraint, refGeometry, config);
}

/**
 * Compute error for Horizontal constraint.
 * @param {Object} constraint
 * @returns {number} Error magnitude
 */
export function computeHorizontalError(constraint) {
    if (constraint.entities.length < 1) return 0;
    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
    const measureQuat = new THREE.Quaternion();
    measureNode.getWorldQuaternion(measureQuat);
    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat);
    const horizontalNormal = new THREE.Vector3(worldNormal.x, 0, worldNormal.z);
    if (horizontalNormal.lengthSq() < 1e-8) return 0;
    horizontalNormal.normalize();
    return worldNormal.angleTo(horizontalNormal);
}
