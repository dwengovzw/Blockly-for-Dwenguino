import * as THREE from "three";
import { clampStep, resolveConstraintPoint, resolveConstraintPlane } from "../utils.js";

/**
 * PRIMITIVE CONSTRAINT: Point-Plane (Twist-based)
 *
 * Forces a point on one body to lie on a plane defined by another body.
 * Constrains 1 translational DOF (along plane normal).
 *
 * Implemented as a small rigid-body twist (Δv, Δω).
 * No pivot is chosen explicitly — the instantaneous pivot emerges naturally.
 *
 * @param {Object} constraint - Constraint definition
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyPointPlane(constraint, refGeometry, config) {
    if (constraint.entities.length < 2) return;

    const stiffness = Math.max(0.0, Math.min(1.0, constraint.weight ?? 1.0));
    const entityWeights = constraint.entityWeights ?? [0.5, 0.5];

    const weight0 = entityWeights[0] ?? 0.5;
    const weight1 = entityWeights[1] ?? 0.5;

    // 1. Get plane definition (world space)
    let plane = null;
    const planeEntity = constraint.entities[1];

    if (constraint.referencePlanes?.[1]) {
        const planeRef = constraint.referencePlanes[1];
        const planeName = typeof planeRef === 'string' ? planeRef : planeRef.name;
        plane = refGeometry.getReferencePlaneWorld(planeEntity.name, planeName);
    }

    if (!plane) {
        const planeNode = planeEntity.node;
        const planeQuat = planeNode.getWorldQuaternion(new THREE.Quaternion());
        plane = {
            normal: new THREE.Vector3(0, 0, 1)
                .applyQuaternion(planeQuat)
                .normalize(),
            point: planeNode.getWorldPosition(new THREE.Vector3())
        };
    }

    const n = plane.normal;

    // 2. Get constrained point (world space)
    const pointEntity = constraint.entities[0];
    let p = null;

    if (constraint.referencePoints?.[0]) {
        const pointName = constraint.referencePoints[0].name;
        p = refGeometry.getReferencePointWorldPosition(pointEntity.name, pointName);
    }

    if (!p) {
        p = pointEntity.node.getWorldPosition(new THREE.Vector3());
    }

    // 3. Compute constraint error
    const signedDistance = n.dot(p.clone().sub(plane.point));

    if (Math.abs(signedDistance) < 1e-6) return;

    // 4. Apply correction to point entity (entity 0)
    const pointNode = pointEntity.node;
    const bodyOrigin = pointNode.getWorldPosition(new THREE.Vector3());

    const r = p.clone().sub(bodyOrigin);

    const translationGain = 0.6 * stiffness * config.constraintGainScale * config.translationWeight;
    const rotationGain = 1.8 * stiffness * config.constraintGainScale * config.rotationWeight;

    const deltaV0 = clampStep(
        n.clone().multiplyScalar(-signedDistance * weight0 * translationGain),
        config.maxLinearStep
    );
    const deltaOmega0 = clampStep(
        r.clone().cross(n).multiplyScalar(-signedDistance * weight0 * rotationGain),
        config.maxAngularStep
    );

    const angle0 = deltaOmega0.length();
    if (angle0 > 1e-8) {
        const axis0 = deltaOmega0.clone().normalize();
        const dq0 = new THREE.Quaternion().setFromAxisAngle(axis0, angle0);
        pointNode.quaternion.premultiply(dq0);
    }
    pointNode.position.add(deltaV0);

    // 5. Apply opposite correction to plane entity (entity 1)
    if (weight1 > 0.0) {
        const planeNode = planeEntity.node;
        const planeOrigin = planeNode.getWorldPosition(new THREE.Vector3());

        const rPlane = plane.point.clone().sub(planeOrigin);

        const deltaV1 = clampStep(
            n.clone().multiplyScalar(signedDistance * weight1 * translationGain),
            config.maxLinearStep
        );
        const deltaOmega1 = clampStep(
            rPlane.clone().cross(n).multiplyScalar(signedDistance * weight1 * rotationGain),
            config.maxAngularStep
        );

        const angle1 = deltaOmega1.length();
        if (angle1 > 1e-8) {
            const axis1 = deltaOmega1.clone().normalize();
            const dq1 = new THREE.Quaternion().setFromAxisAngle(axis1, angle1);
            planeNode.quaternion.premultiply(dq1);
        }
        planeNode.position.add(deltaV1);

        refGeometry.invalidateCache(planeEntity.name);
    }

    // 6. Invalidate reference cache
    refGeometry.invalidateCache(pointEntity.name);
}

/**
 * Compute error for PointPlane constraint.
 * @param {Object} constraint
 * @param {ReferenceGeometry} refGeometry
 * @returns {number} Error magnitude
 */
export function computePointPlaneError(constraint, refGeometry) {
    if (constraint.entities.length < 2) return 0;
    const p = resolveConstraintPoint(constraint, 0, refGeometry);
    const plane = resolveConstraintPlane(constraint, 1, refGeometry);
    return Math.abs(plane.normal.dot(p.clone().sub(plane.point)));
}
