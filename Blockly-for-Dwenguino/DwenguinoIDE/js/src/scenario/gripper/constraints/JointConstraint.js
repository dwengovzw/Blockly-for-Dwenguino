import * as THREE from "three";
import { createVirtualPlaneEntity, resolveConstraintPoint, resolveConstraintPlane } from "../utils.js";
import { applyPlanePlaneParallel } from "./PlanePlaneParallelConstraint.js";
import { applyPointPlane } from "./PointPlaneConstraint.js";

/**
 * Joint Constraint: Constrain two parts to rotate in a specified plane,
 * while keeping joint center points coincident or at a specified offset
 * along the plane normal.
 * Composites on PlanePlaneParallel (plane alignment) + PointPlane (offset distance).
 *
 * @param {Object} constraint - Constraint definition
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyJoint(constraint, refGeometry, config) {
    if (constraint.entities.length < 2) return;
    const weight = constraint.weight ?? 1.0;

    const entityA = constraint.entities[0];
    const entityB = constraint.entities[1];

    const planeNormalValue = constraint.value?.planeNormal;
    let planeNormal = planeNormalValue
        ? new THREE.Vector3(
            planeNormalValue[0] || 0,
            planeNormalValue[1] || 0,
            planeNormalValue[2] || 0
        ).normalize()
        : null;

    let planePoint = constraint.value?.planePoint
        ? new THREE.Vector3(
            constraint.value.planePoint[0] || 0,
            constraint.value.planePoint[1] || 0,
            constraint.value.planePoint[2] || 0
        )
        : null;

    if (!planeNormal) {
        const refPlaneA = constraint.referencePlanes?.[0];
        if (refPlaneA) {
            const planeName = typeof refPlaneA === 'string' ? refPlaneA : refPlaneA.name;
            const planeWorld = refGeometry.getReferencePlaneWorld(entityA.name, planeName);
            if (planeWorld) {
                planeNormal = planeWorld.normal.clone();
                planePoint = planeWorld.point.clone();
            }
        }
    }

    if (!planeNormal) {
        console.warn(`[Constraints] Joint '${constraint.id}' missing planeNormal or referencePlane.`);
        return;
    }

    if (!planePoint) {
        planePoint = entityA.node.getWorldPosition(new THREE.Vector3());
    }

    // 1) Constrain both entities to rotate in the plane
    const virtualPlane = createVirtualPlaneEntity(planeNormal, planePoint, '__virtual_joint_plane__');

    const refPlaneAName = constraint.referencePlanes?.[0] || null;
    if (refPlaneAName) {
        applyPlanePlaneParallel({
            type: 'PlanePlaneParallel',
            entities: [virtualPlane, entityA],
            referencePlanes: [null, refPlaneAName],
            weight
        }, refGeometry, config);
    }

    const refPlaneBName = constraint.referencePlanes?.[1] || null;
    if (refPlaneBName) {
        applyPlanePlaneParallel({
            type: 'PlanePlaneParallel',
            entities: [virtualPlane, entityB],
            referencePlanes: [null, refPlaneBName],
            weight
        }, refGeometry, config);
    }

    // 2) Enforce perpendicular distance between joint centers along plane normal
    const coincident = constraint.value?.coincident ?? false;
    const offset = coincident ? 0.0 : (constraint.value?.offset ?? constraint.value?.distance ?? 0.0);

    let pivotA = null;
    const refPointA = constraint.referencePoints?.[0];
    if (refPointA?.name) {
        pivotA = refGeometry.getReferencePointWorldPosition(entityA.name, refPointA.name);
    }
    if (!pivotA) {
        pivotA = entityA.node.getWorldPosition(new THREE.Vector3());
    }

    const planePointForB = pivotA.clone().add(planeNormal.clone().multiplyScalar(offset));
    const virtualPlaneForB = createVirtualPlaneEntity(
        planeNormal,
        planePointForB,
        '__virtual_joint_offset_plane__'
    );

    const refPointB = constraint.referencePoints?.[1] || null;
    applyPointPlane({
        type: 'PointPlane',
        entities: [entityB, virtualPlaneForB],
        referencePoints: refPointB ? [refPointB, null] : null,
        weight
    }, refGeometry, config);
}

/**
 * Compute error for Joint constraint.
 * @param {Object} constraint
 * @param {ReferenceGeometry} refGeometry
 * @returns {number} Maximum error magnitude
 */
export function computeJointError(constraint, refGeometry) {
    if (constraint.entities.length < 2) return 0;
    let maxError = 0;

    const planeNormalValue = constraint.value?.planeNormal;
    const planeNormal = planeNormalValue
        ? new THREE.Vector3(
            planeNormalValue[0] || 0,
            planeNormalValue[1] || 0,
            planeNormalValue[2] || 0
        ).normalize()
        : null;

    if (planeNormal) {
        for (let i = 0; i < constraint.entities.length; i++) {
            if (constraint.referencePlanes?.[i]) {
                const plane = resolveConstraintPlane(constraint, i, refGeometry);
                const angle = plane.normal.angleTo(planeNormal);
                maxError = Math.max(maxError, angle);
            }
        }
    }

    const pA = resolveConstraintPoint(constraint, 0, refGeometry);
    const pB = resolveConstraintPoint(constraint, 1, refGeometry);

    const coincident = constraint.value?.coincident ?? false;
    const offset = coincident ? 0.0 : (constraint.value?.offset ?? constraint.value?.distance ?? 0.0);
    if (planeNormal) {
        const distance = Math.abs(planeNormal.dot(pB.clone().sub(pA)) - offset);
        maxError = Math.max(maxError, distance);
    }

    return maxError;
}
