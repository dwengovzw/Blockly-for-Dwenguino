import * as THREE from "three";
import { clampStep, resolveConstraintPlane } from "../utils.js";

/**
 * PRIMITIVE CONSTRAINT: Plane-Plane Parallel (Twist-based)
 *
 * Forces plane2 to be parallel to plane1 by aligning normals.
 * Optionally makes planes coincident.
 *
 * Implemented using incremental rigid-body twists (Δv, Δω).
 *
 * @param {Object} constraint - Constraint definition
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @param {Object} config - Solver configuration
 */
export function applyPlanePlaneParallel(constraint, refGeometry, config) {
    if (constraint.entities.length < 2) return;

    const stiffness = Math.max(0.0, Math.min(1.0, constraint.weight ?? 1.0));
    const entityWeights = constraint.entityWeights ?? constraint.entities.map(() => 1.0 / constraint.entities.length);
    const makeCoincident = constraint.value?.coincident ?? false;

    // 1. Get reference plane (plane1)
    let plane1 = null;
    const entity1 = constraint.entities[0];

    if (constraint.referencePlanes?.[0]) {
        plane1 = refGeometry.getReferencePlaneWorld(entity1.name, constraint.referencePlanes[0]);
    }

    if (!plane1) {
        const node1 = entity1.node;
        const q1 = node1.getWorldQuaternion(new THREE.Quaternion());
        plane1 = {
            normal: new THREE.Vector3(0, 0, 1).applyQuaternion(q1).normalize(),
            point: node1.getWorldPosition(new THREE.Vector3())
        };
    }

    const n1 = plane1.normal;
    const weight1 = entityWeights[0] ?? 1.0;

    // 2. Process all other planes
    for (let i = 1; i < constraint.entities.length; i++) {
        const entity2 = constraint.entities[i];
        const node2 = entity2.node;
        const weight2 = entityWeights[i] ?? 1.0;

        let plane2 = null;

        if (constraint.referencePlanes?.[i]) {
            plane2 = refGeometry.getReferencePlaneWorld(entity2.name, constraint.referencePlanes[i]);
        }

        if (!plane2) {
            const q2 = node2.getWorldQuaternion(new THREE.Quaternion());
            plane2 = {
                normal: new THREE.Vector3(0, 0, 1).applyQuaternion(q2).normalize(),
                point: node2.getWorldPosition(new THREE.Vector3())
            };
        }

        const n2 = plane2.normal;

        // 3. ROTATIONAL constraint: align normals
        const normalError = n2.clone().cross(n1);
        const normalErrorMag = normalError.length();

        let deltaOmega2 = new THREE.Vector3();
        let deltaOmega1 = new THREE.Vector3();

        const rotationMultiplier = 1.5 * config.constraintGainScale * config.rotationWeight;

        if (normalErrorMag > 1e-6) {
            deltaOmega2.copy(normalError)
                .multiplyScalar(weight2 * stiffness * rotationMultiplier);

            if (weight1 > 0.0) {
                deltaOmega1.copy(normalError)
                    .multiplyScalar(-weight1 * stiffness * rotationMultiplier);
            }
        }

        // 4. TRANSLATIONAL constraint (optional coincidence)
        let deltaV2 = new THREE.Vector3();
        let deltaV1 = new THREE.Vector3();

        if (makeCoincident) {
            const distance = n1.dot(plane2.point.clone().sub(plane1.point));

            if (Math.abs(distance) > 1e-6) {
                deltaV2.add(
                    n1.clone().multiplyScalar(
                        -distance * weight2 * stiffness * config.constraintGainScale * config.translationWeight
                    )
                );

                if (weight1 > 0.0) {
                    deltaV1.add(
                        n1.clone().multiplyScalar(
                            distance * weight1 * stiffness * config.constraintGainScale * config.translationWeight
                        )
                    );
                }

                const bodyOrigin2 = node2.getWorldPosition(new THREE.Vector3());
                const r2 = plane2.point.clone().sub(bodyOrigin2);

                deltaOmega2.add(
                    r2.clone().cross(n1).multiplyScalar(-distance * weight2 * stiffness)
                );

                if (weight1 > 0.0) {
                    const bodyOrigin1 = entity1.node.getWorldPosition(new THREE.Vector3());
                    const r1 = plane1.point.clone().sub(bodyOrigin1);

                    deltaOmega1.add(
                        r1.clone().cross(n1).multiplyScalar(distance * weight1 * stiffness)
                    );
                }
            }
        }

        // 5. Apply TWIST to plane2 body
        deltaOmega2 = clampStep(deltaOmega2, config.maxAngularStep);
        deltaV2 = clampStep(deltaV2, config.maxLinearStep);

        const angle2 = deltaOmega2.length();
        if (angle2 > 1e-8) {
            const axis2 = deltaOmega2.clone().normalize();
            const dq2 = new THREE.Quaternion().setFromAxisAngle(axis2, angle2);
            node2.quaternion.premultiply(dq2);
        }

        node2.position.add(deltaV2);

        // 6. Apply TWIST to plane1 body (if weight1 > 0)
        if (weight1 > 0.0) {
            const node1 = entity1.node;

            deltaOmega1 = clampStep(deltaOmega1, config.maxAngularStep);
            deltaV1 = clampStep(deltaV1, config.maxLinearStep);

            const angle1 = deltaOmega1.length();
            if (angle1 > 1e-8) {
                const axis1 = deltaOmega1.clone().normalize();
                const dq1 = new THREE.Quaternion().setFromAxisAngle(axis1, angle1);
                node1.quaternion.premultiply(dq1);
            }

            node1.position.add(deltaV1);

            refGeometry.invalidateCache(entity1.name);
        }

        // 7. Invalidate reference cache
        refGeometry.invalidateCache(entity2.name);
    }
}

/**
 * Compute error for PlanePlaneParallel constraint.
 * @param {Object} constraint
 * @param {ReferenceGeometry} refGeometry
 * @returns {number} Maximum error magnitude
 */
export function computePlanePlaneParallelError(constraint, refGeometry) {
    if (constraint.entities.length < 2) return 0;
    const plane1 = resolveConstraintPlane(constraint, 0, refGeometry);
    const n1 = plane1.normal;
    let maxError = 0;

    for (let i = 1; i < constraint.entities.length; i++) {
        const plane2 = resolveConstraintPlane(constraint, i, refGeometry);
        const n2 = plane2.normal;
        const angle = n1.angleTo(n2);
        maxError = Math.max(maxError, angle);

        if (constraint.value?.coincident) {
            const distance = Math.abs(n1.dot(plane2.point.clone().sub(plane1.point)));
            maxError = Math.max(maxError, distance);
        }
    }
    return maxError;
}
