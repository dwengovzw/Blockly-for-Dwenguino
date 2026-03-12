import * as THREE from "three";
import { clampStep, resolveConstraintPoint } from "../utils.js";

/**
 * PRIMITIVE CONSTRAINT: Point-Point Coincidence (Twist-based)
 *
 * Enforces coincidence of two world-space points by applying
 * a small rigid-body motion (twist = translation + rotation).
 *
 * The instantaneous pivot emerges implicitly from the twist.
 * This composes correctly with other constraints.
 *
 * @param {Object} constraint - Constraint definition with entities, weights, etc.
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration (constraintGainScale, translationWeight, etc.)
 */
export function applyPointPointCoincident(constraint, refGeometry, config) {
    if (constraint.entities.length < 2) return;

    const weight = constraint.weight ?? 1.0;
    const stiffness = Math.max(0.0, Math.min(1.0, weight));
    const entityWeights = constraint.entityWeights ?? constraint.entities.map(() => 1.0 / constraint.entities.length);

    // 1. Determine target world-space point (reference)
    let targetPoint = null;

    if (constraint.referencePoints?.[0]) {
        const { entityName, name } = constraint.referencePoints[0];
        targetPoint = refGeometry.getReferencePointWorldPosition(entityName, name);
    }

    if (!targetPoint) {
        targetPoint = constraint.entities[0].node.getWorldPosition(new THREE.Vector3());
    }

    // 2. Apply constraint to all other entities
    for (let i = 1; i < constraint.entities.length; i++) {
        const entity = constraint.entities[i];
        const node = entity.node;

        const weight0 = entityWeights[0] ?? 1.0;
        const weightI = entityWeights[i] ?? 1.0;

        // 2.1 Get constrained point on this body
        let currentPointWorld = null;

        if (constraint.referencePoints?.[i]) {
            const { entityName, name } = constraint.referencePoints[i];
            currentPointWorld = refGeometry.getReferencePointWorldPosition(entityName, name);
        }

        if (!currentPointWorld) {
            currentPointWorld = node.getWorldPosition(new THREE.Vector3());
        }

        // 2.2 Compute positional error
        const error = targetPoint.clone().sub(currentPointWorld);

        if (error.lengthSq() < 1e-8) continue;

        const errorI = error.clone().multiplyScalar(weightI);
        const errorRef = error.clone().multiplyScalar(-weight0);

        // Reference entity correction
        const refEntity = constraint.entities[0];
        const refNode = refEntity.node;
        const refBodyOrigin = refNode.getWorldPosition(new THREE.Vector3());
        let refCurrentPoint = targetPoint.clone();

        if (constraint.referencePoints?.[0]) {
            const { entityName, name } = constraint.referencePoints[0];
            refCurrentPoint = refGeometry.getReferencePointWorldPosition(entityName, name);
        }

        const rRef = refCurrentPoint.clone().sub(refBodyOrigin);

        // 2.3 Rigid body state for current entity
        const bodyOrigin = node.getWorldPosition(new THREE.Vector3());

        const r = currentPointWorld.clone().sub(bodyOrigin);

        // 3. Compute TWIST for the moving entity
        const translationGain = 0.5 * stiffness * config.constraintGainScale * config.translationWeight;
        const rotationGain = 1.5 * stiffness * config.constraintGainScale * config.rotationWeight;

        const deltaV = clampStep(
            errorI.clone().multiplyScalar(translationGain),
            config.maxLinearStep
        );

        const deltaOmega = clampStep(
            r.clone().cross(errorI).multiplyScalar(rotationGain),
            config.maxAngularStep
        );

        // 4. Apply TWIST to the moving entity
        const angle = deltaOmega.length();
        if (angle > 1e-8) {
            const axis = deltaOmega.clone().normalize();
            const dq = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            node.quaternion.premultiply(dq);
        }

        node.position.add(deltaV);

        // 5. Apply opposite correction to reference entity (if weight0 > 0)
        if (weight0 > 0.0) {
            const deltaVRef = clampStep(
                errorRef.clone().multiplyScalar(translationGain),
                config.maxLinearStep
            );
            const deltaOmegaRef = clampStep(
                rRef.clone().cross(errorRef).multiplyScalar(rotationGain),
                config.maxAngularStep
            );

            const angleRef = deltaOmegaRef.length();
            if (angleRef > 1e-8) {
                const axisRef = deltaOmegaRef.clone().normalize();
                const dqRef = new THREE.Quaternion().setFromAxisAngle(axisRef, angleRef);
                refNode.quaternion.premultiply(dqRef);
            }

            refNode.position.add(deltaVRef);
        }

        // 6. Invalidate reference cache (geometry moved)
        refGeometry.invalidateCache(entity.name);
    }
}

/**
 * Compute error for PointPointCoincident constraint.
 * @param {Object} constraint
 * @param {ReferenceGeometry} refGeometry
 * @returns {number} Maximum error magnitude
 */
export function computePointPointCoincidentError(constraint, refGeometry) {
    if (constraint.entities.length < 2) return 0;
    const p0 = resolveConstraintPoint(constraint, 0, refGeometry);
    let maxError = 0;
    for (let i = 1; i < constraint.entities.length; i++) {
        const pi = resolveConstraintPoint(constraint, i, refGeometry);
        maxError = Math.max(maxError, p0.distanceTo(pi));
    }
    return maxError;
}
