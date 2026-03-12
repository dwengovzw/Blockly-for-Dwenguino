import * as THREE from "three";
import { createVirtualPlaneEntity } from "../utils.js";
import { applyPointPointCoincident } from "./PointPointCoincidentConstraint.js";
import { applyPlanePlaneParallel } from "./PlanePlaneParallelConstraint.js";

/**
 * Fixed Constraint: Fixes one or more entities in place (position + orientation).
 * Composites on PointPointCoincident (position) + 2x PlanePlaneParallel (orientation).
 *
 * @param {Object} constraint - Constraint definition with fixedTargets
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyFixed(constraint, refGeometry, config) {
    if (constraint.entities.length < 1) return;
    const weight = constraint.weight ?? 1.0;

    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) {
        console.warn(`[Constraints] Fixed constraint is missing target transforms: ${constraint.id}`);
        return;
    }

    for (let i = 0; i < constraint.entities.length; i++) {
        const entity = constraint.entities[i];
        const target = constraint.fixedTargets[i];

        // Step 1: Position fix via PointPointCoincident
        const virtualPointNode = new THREE.Object3D();
        virtualPointNode.position.copy(target.position);
        const virtualPointEntity = { name: '__virtual_fixed_point__', node: virtualPointNode };

        const positionConstraint = {
            type: 'PointPointCoincident',
            entities: [virtualPointEntity, entity],
            weight: weight
        };
        applyPointPointCoincident(positionConstraint, refGeometry, config);

        // Step 2: Orientation fix via two PlanePlaneParallel constraints (Z and X axes)
        const targetNormalZ = new THREE.Vector3(0, 0, 1).applyQuaternion(target.quaternion);
        const targetNormalX = new THREE.Vector3(1, 0, 0).applyQuaternion(target.quaternion);

        const virtualPlaneZ = createVirtualPlaneEntity(targetNormalZ, target.position, '__virtual_fixed_plane_z__');
        const virtualPlaneX = createVirtualPlaneEntity(targetNormalX, target.position, '__virtual_fixed_plane_x__');

        const orientationConstraintZ = {
            type: 'PlanePlaneParallel',
            entities: [virtualPlaneZ, entity],
            weight: weight
        };
        const orientationConstraintX = {
            type: 'PlanePlaneParallel',
            entities: [virtualPlaneX, entity],
            weight: weight
        };

        applyPlanePlaneParallel(orientationConstraintZ, refGeometry, config);
        applyPlanePlaneParallel(orientationConstraintX, refGeometry, config);
    }
}

/**
 * Compute error for Fixed constraint.
 * @param {Object} constraint
 * @returns {number} Maximum error magnitude
 */
export function computeFixedError(constraint) {
    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) return 0;
    let maxError = 0;
    for (let i = 0; i < constraint.entities.length; i++) {
        const node = constraint.entities[i].node;
        const target = constraint.fixedTargets[i];
        const pos = node.getWorldPosition(new THREE.Vector3());
        const quat = node.getWorldQuaternion(new THREE.Quaternion());
        maxError = Math.max(maxError, pos.distanceTo(target.position));
        maxError = Math.max(maxError, quat.angleTo(target.quaternion));
    }
    return maxError;
}
