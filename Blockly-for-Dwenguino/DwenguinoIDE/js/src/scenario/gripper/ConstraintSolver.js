import * as THREE from "three";
import { applyPointPointCoincident, computePointPointCoincidentError } from "./constraints/PointPointCoincidentConstraint.js";
import { applyPointPlane, computePointPlaneError } from "./constraints/PointPlaneConstraint.js";
import { applyPlanePlaneParallel, computePlanePlaneParallelError } from "./constraints/PlanePlaneParallelConstraint.js";
import { applyHorizontal, computeHorizontalError } from "./constraints/HorizontalConstraint.js";
import { applyVertical, computeVerticalError } from "./constraints/VerticalConstraint.js";
import { applyFixed, computeFixedError } from "./constraints/FixedConstraint.js";
import { applyFixedJoint, computeFixedJointError } from "./constraints/FixedJointConstraint.js";
import { applyJoint, computeJointError } from "./constraints/JointConstraint.js";

/**
 * Registry mapping constraint type names (uppercase) to their apply and computeError functions.
 */
const CONSTRAINT_REGISTRY = {
    'POINTPOINTCOINCIDENT': { apply: applyPointPointCoincident, computeError: computePointPointCoincidentError },
    'POINTPLANE':           { apply: applyPointPlane,           computeError: computePointPlaneError },
    'PLANEPARALLEL':        { apply: applyPlanePlaneParallel,   computeError: computePlanePlaneParallelError },
    'HORIZONTAL':           { apply: applyHorizontal,           computeError: computeHorizontalError },
    'VERTICAL':             { apply: applyVertical,             computeError: computeVerticalError },
    'FIXED':                { apply: applyFixed,                computeError: computeFixedError },
    'FIXEDJOINT':           { apply: applyFixedJoint,           computeError: computeFixedJointError },
    'JOINT':                { apply: applyJoint,                computeError: computeJointError },
};

/**
 * Iterative constraint solver for mechanical relationships between 3D parts.
 * Parses constraints from a kinematics descriptor, resolves entity references,
 * and iteratively applies constraints until convergence.
 */
class ConstraintSolver {
    /** @type {ReferenceGeometry} */
    refGeometry = null;
    /** @type {Array} Resolved constraint objects */
    constraints = [];
    /** @type {Array<string>} Detected constraint conflicts */
    constraintConflicts = [];

    // Solver configuration
    maxIterations = 10;
    convergenceThreshold = 0.001;
    enableConflictDetection = true;
    constraintGainScale = 1.0;
    translationWeight = 1.0;
    rotationWeight = 1.0;
    maxLinearStep = 0.0;
    maxAngularStep = 0.0;
    instantMotion = true;

    /**
     * @param {ReferenceGeometry} refGeometry
     */
    constructor(refGeometry) {
        this.refGeometry = refGeometry;
    }

    /**
     * Get the current solver configuration object passed to constraint functions.
     * @returns {Object}
     */
    getConfig() {
        return {
            constraintGainScale: this.constraintGainScale,
            translationWeight: this.translationWeight,
            rotationWeight: this.rotationWeight,
            maxLinearStep: this.maxLinearStep,
            maxAngularStep: this.maxAngularStep,
        };
    }

    /**
     * Initialize and validate constraints from a kinematics descriptor.
     * Parses solver configuration, normalizes entity definitions,
     * resolves Three.js nodes, validates weights, and detects conflicts.
     *
     * @param {Object} descriptor - Kinematics descriptor
     * @param {THREE.Object3D} modelRoot - Root of the 3D model for node lookups
     */
    initialize(descriptor, modelRoot) {
        this.constraints = [];
        this.constraintConflicts = [];

        // Parse solver configuration
        if (descriptor?.constraintSolver) {
            const config = descriptor.constraintSolver;
            this.instantMotion = config.instantMotion ?? true;
            this.maxIterations = config.maxIterations ?? (this.instantMotion ? 50 : 10);
            this.convergenceThreshold = config.convergenceThreshold ?? 0.001;
            this.enableConflictDetection = config.enableConflictDetection ?? true;
            this.constraintGainScale = config.gainScale ?? (this.instantMotion ? 2.0 : 1.0);
            this.translationWeight = config.translationWeight ?? 1.0;
            this.rotationWeight = config.rotationWeight ?? 1.0;
            this.maxLinearStep = config.maxLinearStep ?? 0.0;
            this.maxAngularStep = config.maxAngularStep ?? 0.0;
        }

        if (!descriptor?.constraints) return;

        for (let constraintDef of descriptor.constraints) {
            if (!constraintDef.type || !constraintDef.entities) {
                console.warn(`[ConstraintSolver] Invalid constraint definition:`, constraintDef);
                continue;
            }

            // Normalize entities
            const normalizedEntities = [];
            for (let i = 0; i < constraintDef.entities.length; i++) {
                const entry = constraintDef.entities[i];
                if (typeof entry === 'string') {
                    normalizedEntities.push({
                        name: entry,
                        referencePoint: constraintDef.referencePoints?.[i],
                        referencePlane: constraintDef.referencePlanes?.[i],
                        datum: constraintDef.datums?.[i],
                        entityWeight: constraintDef.entityWeights?.[i] ?? 1.0
                    });
                } else if (entry && typeof entry === 'object') {
                    const name = entry.name ?? entry.entity ?? entry.part;
                    if (!name) {
                        console.warn(`[ConstraintSolver] Entity object missing name:`, entry);
                        continue;
                    }
                    normalizedEntities.push({
                        name,
                        referencePoint: entry.referencePoint ?? entry.referencePointName ?? entry.refPoint,
                        referencePlane: entry.referencePlane ?? entry.referencePlaneName ?? entry.refPlane,
                        datum: entry.datum,
                        entityWeight: typeof entry.weight === 'number' ? entry.weight : 1.0
                    });
                } else {
                    console.warn(`[ConstraintSolver] Invalid entity entry:`, entry);
                }
            }

            // Resolve entity references to Three.js nodes
            let resolvedEntities = [];
            for (let entityDef of normalizedEntities) {
                let entity = modelRoot.getObjectByName(entityDef.name);
                if (!entity) {
                    console.warn(`[ConstraintSolver] Constraint entity not found: ${entityDef.name}`);
                    continue;
                }
                resolvedEntities.push({ name: entityDef.name, node: entity });
            }

            if (resolvedEntities.length < normalizedEntities.length) {
                console.warn(`[ConstraintSolver] Some entities not found for constraint:`, constraintDef);
                continue;
            }

            // Resolve optional reference points
            const resolvedReferencePoints = normalizedEntities.map(entityDef => {
                if (!entityDef.referencePoint) return null;
                return { name: entityDef.referencePoint, entityName: entityDef.name };
            });
            const hasReferencePoints = resolvedReferencePoints.some(Boolean);

            // Resolve optional reference planes
            const resolvedReferencePlanes = normalizedEntities.map(entityDef =>
                entityDef.referencePlane ? entityDef.referencePlane : null
            );
            const hasReferencePlanes = resolvedReferencePlanes.some(Boolean);

            // Resolve optional datum references (legacy)
            let resolvedDatums = null;
            const datumNames = normalizedEntities.map(entityDef => entityDef.datum ?? null);
            if (datumNames.some(Boolean)) {
                resolvedDatums = [];
                for (let datumName of datumNames) {
                    if (!datumName) {
                        resolvedDatums.push(null);
                        continue;
                    }
                    let datumNode = modelRoot.getObjectByName(datumName);
                    if (!datumNode) {
                        console.warn(`[ConstraintSolver] Datum not found: ${datumName}`);
                        resolvedDatums = null;
                        break;
                    }
                    resolvedDatums.push({ name: datumName, node: datumNode });
                }
            }

            // Validate weight
            let weight = constraintDef.weight ?? 1.0;
            if (typeof weight !== 'number' || weight < 0 || weight > 1) {
                console.warn(`[ConstraintSolver] Invalid weight ${weight} for constraint '${constraintDef.id}', using 1.0`);
                weight = 1.0;
            }

            // Normalize per-entity weights
            const entityWeights = normalizedEntities.map(e => e.entityWeight ?? 1.0);
            const totalWeight = entityWeights.reduce((sum, w) => sum + w, 0);
            const normalizedEntityWeights = totalWeight > 0
                ? entityWeights.map(w => w / totalWeight)
                : entityWeights.map(() => 1.0 / entityWeights.length);

            // Store validated constraint
            this.constraints.push({
                id: constraintDef.id || `constraint_${this.constraints.length}`,
                type: constraintDef.type,
                entities: resolvedEntities,
                entityWeights: normalizedEntityWeights,
                referencePoints: hasReferencePoints ? resolvedReferencePoints : null,
                referencePlanes: hasReferencePlanes ? resolvedReferencePlanes : null,
                datums: resolvedDatums,
                weight: weight,
                value: constraintDef.value,
                definition: constraintDef,
                fixedTargets: null
            });

            // Precompute Fixed target transforms
            if (constraintDef.type && constraintDef.type.toUpperCase() === "FIXED") {
                const fixedTargets = [];
                for (let i = 0; i < resolvedEntities.length; i++) {
                    const measureNode = resolvedDatums ? resolvedDatums[i].node : resolvedEntities[i].node;
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion();
                    measureNode.getWorldPosition(worldPos);
                    measureNode.getWorldQuaternion(worldQuat);
                    fixedTargets.push({ position: worldPos, quaternion: worldQuat });
                }
                this.constraints[this.constraints.length - 1].fixedTargets = fixedTargets;
            }

            // Precompute FixedJoint targets
            if (constraintDef.type && constraintDef.type.toUpperCase() === "FIXEDJOINT") {
                const fixedJointTargets = [];
                const planeNormal = constraintDef.value?.planeNormal
                    ? new THREE.Vector3(
                        constraintDef.value.planeNormal[0] || 0,
                        constraintDef.value.planeNormal[1] || 0,
                        constraintDef.value.planeNormal[2] || 0
                    ).normalize()
                    : null;
                const planePoint = constraintDef.value?.planePoint
                    ? new THREE.Vector3(
                        constraintDef.value.planePoint[0] || 0,
                        constraintDef.value.planePoint[1] || 0,
                        constraintDef.value.planePoint[2] || 0
                    )
                    : null;

                for (let i = 0; i < resolvedEntities.length; i++) {
                    const entity = resolvedEntities[i];
                    const refPointDef = hasReferencePoints ? resolvedReferencePoints[i] : null;
                    let pivotWorld = null;

                    if (refPointDef?.name) {
                        pivotWorld = this.refGeometry.getReferencePointWorldPosition(entity.name, refPointDef.name);
                    }

                    if (!pivotWorld) {
                        pivotWorld = entity.node.getWorldPosition(new THREE.Vector3());
                    }

                    fixedJointTargets.push({
                        position: pivotWorld,
                        planeNormal,
                        planePoint: planePoint ?? pivotWorld,
                        referencePlane: hasReferencePlanes ? resolvedReferencePlanes[i] : null
                    });
                }

                this.constraints[this.constraints.length - 1].fixedTargets = fixedJointTargets;
            }
        }

        console.log(`[ConstraintSolver] Initialized ${this.constraints.length} constraints (max ${this.maxIterations} iterations)`);

        // Detect conflicts if enabled
        if (this.enableConflictDetection && this.constraints.length > 1) {
            this.detectConflicts();
            if (this.constraintConflicts.length > 0) {
                console.warn(`[ConstraintSolver] Detected ${this.constraintConflicts.length} potential conflicts:`);
                this.constraintConflicts.forEach(conflict => console.warn(`  - ${conflict}`));
            }
        }
    }

    /**
     * Detect potential conflicts between constraints.
     */
    detectConflicts() {
        this.constraintConflicts = [];

        for (let i = 0; i < this.constraints.length; i++) {
            for (let j = i + 1; j < this.constraints.length; j++) {
                const c1 = this.constraints[i];
                const c2 = this.constraints[j];

                const sharedEntities = c1.entities.filter(e1 =>
                    c2.entities.some(e2 => e2.name === e1.name)
                );

                if (sharedEntities.length === 0) continue;

                // Horizontal + Vertical conflict
                if ((c1.type === 'Horizontal' && c2.type === 'Vertical') ||
                    (c1.type === 'Vertical' && c2.type === 'Horizontal')) {
                    this.constraintConflicts.push(
                        `Constraints '${c1.id}' (${c1.type}) and '${c2.id}' (${c2.type}) conflict on entities: ${sharedEntities.map(e => e.name).join(', ')} - Cannot be both horizontal and vertical`
                    );
                }
            }
        }

        // Check for over-constrained entities
        const entityConstraintCount = new Map();
        this.constraints.forEach(constraint => {
            constraint.entities.forEach(entity => {
                const count = entityConstraintCount.get(entity.name) || 0;
                entityConstraintCount.set(entity.name, count + 1);
            });
        });

        entityConstraintCount.forEach((count, entityName) => {
            if (count > 3) {
                this.constraintConflicts.push(
                    `Entity '${entityName}' is over-constrained with ${count} constraints (may cause instability)`
                );
            }
        });
    }

    /**
     * Run the iterative constraint solver.
     * Applies all constraints repeatedly until convergence or max iterations reached.
     */
    solve() {
        if (this.constraints.length === 0) return;

        const sortedConstraints = [...this.constraints].sort((a, b) => b.weight - a.weight);
        const config = this.getConfig();
        let previousState = this.captureEntityState();

        for (let iteration = 0; iteration < this.maxIterations; iteration++) {
            this.refGeometry.invalidateCache(null);

            for (let constraint of sortedConstraints) {
                this.applyConstraint(constraint, config);
            }

            const currentState = this.captureEntityState();
            const maxDelta = this.computeMaxStateDelta(previousState, currentState);
            const maxError = this.computeMaxConstraintError(sortedConstraints);

            if (maxDelta < this.convergenceThreshold && maxError < this.convergenceThreshold) {
                if (iteration > 0) {
                    console.log(`[ConstraintSolver] Converged in ${iteration + 1} iterations (delta: ${maxDelta.toFixed(6)}, error: ${maxError.toFixed(6)})`);
                }
                return;
            }

            previousState = currentState;
        }

        console.warn(`[ConstraintSolver] Did not converge after ${this.maxIterations} iterations`);
    }

    /**
     * Apply a single constraint using the registry.
     * @param {Object} constraint
     * @param {Object} config
     */
    applyConstraint(constraint, config) {
        const handler = CONSTRAINT_REGISTRY[constraint.type.toUpperCase()];
        if (handler) {
            handler.apply(constraint, this.refGeometry, config);
        } else {
            console.warn(`[ConstraintSolver] Unknown constraint type: ${constraint.type}`);
        }
    }

    /**
     * Capture current state of all constrained entities.
     * @returns {Map}
     */
    captureEntityState() {
        const state = new Map();
        const processed = new Set();

        this.constraints.forEach(constraint => {
            constraint.entities.forEach(entity => {
                if (!processed.has(entity.name)) {
                    processed.add(entity.name);
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion();
                    entity.node.getWorldPosition(worldPos);
                    entity.node.getWorldQuaternion(worldQuat);
                    state.set(entity.name, {
                        position: worldPos.clone(),
                        quaternion: worldQuat.clone()
                    });
                }
            });
        });

        return state;
    }

    /**
     * Compute maximum state change between two snapshots.
     * @returns {number}
     */
    computeMaxStateDelta(prevState, currentState) {
        let maxDelta = 0;

        currentState.forEach((current, entityName) => {
            const prev = prevState.get(entityName);
            if (!prev) return;

            const posDelta = current.position.distanceTo(prev.position);
            maxDelta = Math.max(maxDelta, posDelta);

            const rotDelta = current.quaternion.angleTo(prev.quaternion);
            maxDelta = Math.max(maxDelta, rotDelta);
        });

        return maxDelta;
    }

    /**
     * Compute maximum constraint error across all constraints.
     * @param {Array} constraints
     * @returns {number}
     */
    computeMaxConstraintError(constraints) {
        let maxError = 0;

        for (const constraint of constraints) {
            const handler = CONSTRAINT_REGISTRY[constraint.type?.toUpperCase()];
            if (handler?.computeError) {
                const error = handler.computeError(constraint, this.refGeometry);
                maxError = Math.max(maxError, error);
            }
        }

        return maxError;
    }
}

export default ConstraintSolver;
