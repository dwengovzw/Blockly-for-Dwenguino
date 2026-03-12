import * as THREE from "three";
import { createVirtualPlaneEntity, resolveConstraintPoint, resolveConstraintPlane } from "../utils.js";
import { applyPointPointCoincident } from "./PointPointCoincidentConstraint.js";
import { applyPlanePlaneParallel } from "./PlanePlaneParallelConstraint.js";

/**
 * FixedJoint Constraint: Fix a pivot point in place, optionally constrain rotation to a plane.
 * Composites on PointPointCoincident (pivot position) + optional PlanePlaneParallel (rotation plane).
 *
 * @param {Object} constraint - Constraint definition with fixedTargets
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyFixedJoint(constraint, refGeometry, config) {
    if (constraint.entities.length < 1) return;
    const weight = constraint.weight ?? 1.0;

    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) {
        console.warn(`[Constraints] FixedJoint constraint is missing target transforms: ${constraint.id}`);
        return;
    }

    for (let i = 0; i < constraint.entities.length; i++) {
        const entity = constraint.entities[i];
        const target = constraint.fixedTargets[i];

        // 1) Fix pivot point position
        const virtualPointNode = new THREE.Object3D();
        virtualPointNode.position.copy(target.position);
        const virtualPointEntity = { name: '__virtual_fixed_joint_point__', node: virtualPointNode };

        const refPointDef = constraint.referencePoints?.[i] || null;
        const positionConstraint = {
            type: 'PointPointCoincident',
            entities: [virtualPointEntity, entity],
            referencePoints: refPointDef ? [null, refPointDef] : null,
            entityWeights: [0.0, 1.0],
            weight: weight
        };
        applyPointPointCoincident(positionConstraint, refGeometry, config);

        // 2) Optional rotation plane constraint
        if (target.planeNormal) {
            if (!target.referencePlane) {
                console.warn(`[Constraints] FixedJoint '${constraint.id}' has planeNormal but no referencePlane for entity '${entity.name}'.`);
                continue;
            }

            const virtualPlane = createVirtualPlaneEntity(
                target.planeNormal,
                target.planePoint ?? target.position,
                '__virtual_fixed_joint_plane__'
            );

            const planeConstraint = {
                type: 'PlanePlaneParallel',
                entities: [virtualPlane, entity],
                referencePlanes: [null, target.referencePlane],
                weight: weight
            };

            applyPlanePlaneParallel(planeConstraint, refGeometry, config);
        }
    }
}

/**
 * Compute error for FixedJoint constraint.
 * @param {Object} constraint
 * @param {ReferenceGeometry} refGeometry
 * @returns {number} Maximum error magnitude
 */
export function computeFixedJointError(constraint, refGeometry) {
    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) return 0;
    let maxError = 0;
    for (let i = 0; i < constraint.entities.length; i++) {
        const target = constraint.fixedTargets[i];
        const point = resolveConstraintPoint(constraint, i, refGeometry);
        maxError = Math.max(maxError, point.distanceTo(target.position));

        if (target.planeNormal && target.referencePlane) {
            const plane = resolveConstraintPlane(constraint, i, refGeometry);
            const targetNormal = target.planeNormal.clone().normalize();
            const angle = plane.normal.angleTo(targetNormal);
            maxError = Math.max(maxError, angle);
        }
    }
    return maxError;
}
