import * as THREE from "three";
import { applyWorldTransform } from "./utils.js";

/**
 * Manages the kinematic mapping from servo motor angles to 3D joint rotations.
 * Handles joint binding, servo smoothing, and pose reset.
 */
class KinematicsEngine {
    /** @type {import('./ReferenceGeometry.js').default} */
    refGeometry = null;

    /** @type {Array<Object>} Bound joint descriptors with node references */
    joints = [];

    /** @type {Map<number, number>} Current (smoothed) servo angles by index */
    currentServoAngles = new Map();

    /** @type {Map<number, number>} Target servo angles by index */
    targetServoAngles = new Map();

    /** @type {number|null} Timestamp of the last smoothing update */
    lastUpdateTimestampMs = null;

    /** @type {number} Maximum servo rotation speed in degrees per second */
    servoSpeedDegPerSec = 120;

    /** @type {boolean} When true, servos snap to target instantly (no smoothing) */
    instantMotion = true;

    /** @type {number} Count of simulation updates since last reset */
    updateCounter = 0;

    /** @type {number} Number of initial updates to skip (filters out transient zero-angle pulses) */
    initializationSkipCount = 4;

    /**
     * @param {import('./ReferenceGeometry.js').default} refGeometry - Reference geometry resolver
     */
    constructor(refGeometry) {
        this.refGeometry = refGeometry;
    }

    /**
     * Bind joint descriptors to their 3D model nodes.
     * For each joint in the descriptor, finds the corresponding node in the model,
     * stores initial transforms, and resolves axis points.
     *
     * @param {Object} descriptor - Kinematics descriptor with joints array
     * @param {THREE.Object3D} modelRoot - Root node of the 3D model
     */
    bindJoints(descriptor, modelRoot) {
        this.joints = [];

        if (!modelRoot || !descriptor) {
            return;
        }

        if (descriptor.joints) {
            for (let joint of descriptor.joints) {
                let node = modelRoot.getObjectByName(joint.node);
                if (!node) {
                    console.warn(`[KinematicsEngine] Joint node not found: ${joint.node}`);
                    continue;
                }

                if (!node.userData.initialWorldQuaternion) {
                    node.userData.initialWorldQuaternion = new THREE.Quaternion();
                    node.getWorldQuaternion(node.userData.initialWorldQuaternion);
                }
                if (!node.userData.initialWorldPosition) {
                    node.userData.initialWorldPosition = new THREE.Vector3();
                    node.getWorldPosition(node.userData.initialWorldPosition);
                }
                if (!node.userData.initialLocalQuaternion) {
                    node.userData.initialLocalQuaternion = node.quaternion.clone();
                }
                if (!node.userData.initialLocalPosition) {
                    node.userData.initialLocalPosition = node.position.clone();
                }

                // Resolve and cache axis point in part's local space (if specified)
                let axisPointPartLocal = null;
                const axisPointRef = joint.axisPoint;
                if (axisPointRef) {
                    if (typeof axisPointRef === 'string') {
                        const partDef = this.refGeometry.getPartDefinition(joint.node);
                        if (partDef?.referencePoints?.[axisPointRef]) {
                            const refPoint = partDef.referencePoints[axisPointRef];
                            axisPointPartLocal = new THREE.Vector3(
                                refPoint.x || 0,
                                refPoint.y || 0,
                                refPoint.z || 0
                            );
                        }
                    } else if (typeof axisPointRef === 'object') {
                        axisPointPartLocal = new THREE.Vector3(
                            axisPointRef.x || 0,
                            axisPointRef.y || 0,
                            axisPointRef.z || 0
                        );
                    }
                }

                // Calculate axis point in world space
                let axisPointWorld = null;
                if (axisPointPartLocal) {
                    axisPointWorld = axisPointPartLocal.clone();
                    axisPointWorld.applyQuaternion(node.userData.initialLocalQuaternion);
                    axisPointWorld.add(node.userData.initialLocalPosition);
                    if (node.parent) {
                        const parentWorldPos = new THREE.Vector3();
                        const parentWorldQuat = new THREE.Quaternion();
                        node.parent.getWorldPosition(parentWorldPos);
                        node.parent.getWorldQuaternion(parentWorldQuat);
                        axisPointWorld.applyQuaternion(parentWorldQuat);
                        axisPointWorld.add(parentWorldPos);
                    }
                }

                // Store parent's initial world transform for dynamic axis adjustment
                let parentBaseWorldQuat = new THREE.Quaternion();
                let parentBaseWorldPos = new THREE.Vector3();
                if (node.parent) {
                    node.parent.getWorldQuaternion(parentBaseWorldQuat);
                    node.parent.getWorldPosition(parentBaseWorldPos);
                }

                this.joints.push({
                    descriptor: joint,
                    node: node,
                    baseWorldQuaternion: node.userData.initialWorldQuaternion.clone(),
                    baseWorldPosition: node.userData.initialWorldPosition.clone(),
                    parentBaseWorldQuat: parentBaseWorldQuat.clone(),
                    parentBaseWorldPos: parentBaseWorldPos.clone(),
                    axisPointLocal: axisPointPartLocal,
                    axisPointWorld: axisPointWorld
                });
            }
        }
    }

    /**
     * Apply servo angles from board state to 3D joint rotations.
     * Core kinematic mapping: reads servo state → maps to joint angles → applies 3D rotation.
     *
     * @param {Object} boardState - Current state of the Dwenguino board
     */
    applyServoState(boardState) {
        if (this.joints.length === 0) {
            return;
        }

        for (let jointBinding of this.joints) {
            let descriptor = jointBinding.descriptor;
            let servoIndex = descriptor?.servo?.index ?? 1;
            let servoMin = descriptor?.servo?.min ?? 0;
            let servoMax = descriptor?.servo?.max ?? 180;
            let servoInvert = descriptor?.servo?.invert ?? false;
            let servoInitialAngle = descriptor?.servo?.initialAngle ?? 0;

            let servoAngle = this.getSmoothedServoAngle(servoIndex, boardState);

            // Map servo angle [servoMin, servoMax] → [0, 1]
            let t = 0;
            if (servoMax !== servoMin) {
                t = (servoAngle - servoMin) / (servoMax - servoMin);
            }
            t = Math.max(0, Math.min(1, t));
            if (servoInvert) {
                t = 1 - t;
            }

            // Map [0, 1] → joint angle range
            let minDeg = descriptor?.minDeg ?? 0;
            let maxDeg = descriptor?.maxDeg ?? 0;
            let jointAngleDeg = minDeg + t * (maxDeg - minDeg);

            // Subtract initial angle for relative rotation from base pose
            jointAngleDeg -= servoInitialAngle;

            // Create rotation axis in world space
            let axisValues = descriptor?.axis ?? [0, 0, 1];
            let axis = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]);
            if (axis.length() === 0) {
                axis.set(0, 0, 1);
            }
            axis.normalize();
            axis.applyQuaternion(jointBinding.baseWorldQuaternion);

            // Dynamic parent rotation: adjust axis based on parent's current rotation
            if (jointBinding.node.parent) {
                const parentCurrentQuat = new THREE.Quaternion();
                jointBinding.node.parent.getWorldQuaternion(parentCurrentQuat);

                const parentRotationDelta = parentCurrentQuat.clone()
                    .multiply(jointBinding.parentBaseWorldQuat.clone().invert());

                axis.applyQuaternion(parentRotationDelta);
            }

            let rotation = new THREE.Quaternion().setFromAxisAngle(
                axis, THREE.MathUtils.degToRad(jointAngleDeg)
            );

            // For child nodes, recalculate base position based on parent's current transform
            let effectiveBaseWorldPos = jointBinding.baseWorldPosition.clone();
            let effectiveBaseWorldQuat = jointBinding.baseWorldQuaternion.clone();
            let effectiveAxisPointWorld = jointBinding.axisPointWorld?.clone() || null;

            if (jointBinding.node.parent) {
                const parentInitialQuat = jointBinding.parentBaseWorldQuat;
                const parentInitialPos = jointBinding.parentBaseWorldPos;

                const childLocalPosInParentFrame = jointBinding.baseWorldPosition.clone()
                    .sub(parentInitialPos)
                    .applyQuaternion(parentInitialQuat.clone().invert());

                const childLocalQuatInParentFrame = parentInitialQuat.clone()
                    .invert()
                    .multiply(jointBinding.baseWorldQuaternion);

                const parentCurrentPos = new THREE.Vector3();
                const parentCurrentQuat = new THREE.Quaternion();
                jointBinding.node.parent.getWorldPosition(parentCurrentPos);
                jointBinding.node.parent.getWorldQuaternion(parentCurrentQuat);

                effectiveBaseWorldPos = childLocalPosInParentFrame.clone()
                    .applyQuaternion(parentCurrentQuat)
                    .add(parentCurrentPos);

                effectiveBaseWorldQuat = parentCurrentQuat.clone()
                    .multiply(childLocalQuatInParentFrame);

                if (jointBinding.axisPointLocal) {
                    effectiveAxisPointWorld = jointBinding.axisPointLocal.clone()
                        .applyQuaternion(effectiveBaseWorldQuat)
                        .add(effectiveBaseWorldPos);
                }
            }

            // Apply rotation around axis point (or center)
            if (effectiveAxisPointWorld) {
                const relativePos = effectiveBaseWorldPos.clone().sub(effectiveAxisPointWorld);
                relativePos.applyQuaternion(rotation);
                const newWorldPos = effectiveAxisPointWorld.clone().add(relativePos);
                const newWorldQuat = effectiveBaseWorldQuat.clone().multiply(rotation);
                applyWorldTransform(jointBinding.node, newWorldPos, newWorldQuat);
            } else {
                const newWorldQuat = effectiveBaseWorldQuat.clone().multiply(rotation);
                applyWorldTransform(jointBinding.node, effectiveBaseWorldPos, newWorldQuat);
            }

            // Invalidate reference point cache since this joint moved
            this.refGeometry.invalidateCache(descriptor?.node);
        }
    }

    /**
     * Seed smoothing maps with initial servo angles from the descriptor.
     * Uses descriptor-defined initial values, or defaults to midpoint of servo range.
     *
     * @param {Object} descriptor - Kinematics descriptor with joints array
     */
    seedServoAnglesFromDescriptor(descriptor) {
        if (!descriptor || !descriptor.joints) {
            return;
        }
        for (let joint of descriptor.joints) {
            let servoIndex = joint?.servo?.index ?? 1;
            let initialAngle = joint?.servo?.initial;
            if (initialAngle === undefined) {
                let servoMin = joint?.servo?.min ?? 0;
                let servoMax = joint?.servo?.max ?? 180;
                initialAngle = (servoMin + servoMax) / 2;
            }
            this.currentServoAngles.set(servoIndex, initialAngle);
            this.targetServoAngles.set(servoIndex, initialAngle);
        }
    }

    /**
     * Update target servo angles from the board state.
     * Skips the first few updates to filter out initialization glitches.
     *
     * @param {Object} boardState - Current board state
     */
    updateTargetServoAngles(boardState) {
        if (!boardState) {
            return;
        }

        this.updateCounter++;
        if (this.updateCounter <= this.initializationSkipCount) {
            console.log(`[KinematicsEngine] Skipping update ${this.updateCounter}/${this.initializationSkipCount} (filtering initialization glitches)`);
            return;
        }

        for (let jointBinding of this.joints) {
            let servoIndex = jointBinding.descriptor?.servo?.index ?? 1;
            let targetAngle = this.getServoAngle(boardState, servoIndex);
            this.targetServoAngles.set(servoIndex, targetAngle);

            if (!this.currentServoAngles.has(servoIndex)) {
                this.currentServoAngles.set(servoIndex, targetAngle);
            }
        }
    }

    /**
     * Smoothly interpolate current servo angles toward targets over time.
     */
    updateSmoothedServoAngles() {
        if (this.instantMotion) {
            for (let [servoIndex, targetAngle] of this.targetServoAngles.entries()) {
                this.currentServoAngles.set(servoIndex, targetAngle);
            }
            return;
        }

        let nowMs = performance.now();
        if (this.lastUpdateTimestampMs === null) {
            this.lastUpdateTimestampMs = nowMs;
            return;
        }
        let deltaSeconds = (nowMs - this.lastUpdateTimestampMs) / 1000;
        this.lastUpdateTimestampMs = nowMs;

        let maxStep = this.servoSpeedDegPerSec * deltaSeconds;

        for (let [servoIndex, targetAngle] of this.targetServoAngles.entries()) {
            let currentAngle = this.currentServoAngles.get(servoIndex) ?? targetAngle;
            let delta = targetAngle - currentAngle;
            if (Math.abs(delta) <= maxStep) {
                currentAngle = targetAngle;
            } else {
                currentAngle += Math.sign(delta) * maxStep;
            }
            this.currentServoAngles.set(servoIndex, currentAngle);
        }
    }

    /**
     * Get the current smoothed servo angle.
     * Falls back to raw board state if smoothing is not initialized.
     *
     * @param {number} servoIndex
     * @param {Object} boardState
     * @returns {number} Smoothed angle in degrees
     */
    getSmoothedServoAngle(servoIndex, boardState) {
        if (this.currentServoAngles.has(servoIndex)) {
            return this.currentServoAngles.get(servoIndex);
        }
        return this.getServoAngle(boardState, servoIndex);
    }

    /**
     * Safely retrieve a servo angle from board state.
     *
     * @param {Object} boardState
     * @param {number} servoIndex
     * @returns {number} Servo angle in degrees (0 on error)
     */
    getServoAngle(boardState, servoIndex) {
        if (!boardState || typeof boardState.getServoAngle !== "function") {
            return 0;
        }
        let angle = boardState.getServoAngle(servoIndex);
        if (angle === undefined || angle === null || Number.isNaN(angle)) {
            return 0;
        }
        return angle;
    }

    /**
     * Reset model joints to their initial transforms.
     */
    resetModelPose() {
        // First pass: restore world-space transforms
        for (let jointBinding of this.joints) {
            applyWorldTransform(
                jointBinding.node,
                jointBinding.baseWorldPosition,
                jointBinding.baseWorldQuaternion
            );
        }

        // Second pass: restore local coordinates for child nodes
        for (let jointBinding of this.joints) {
            if (jointBinding.node.parent && jointBinding.parentBaseWorldPos && jointBinding.parentBaseWorldQuat) {
                const parentInitialQuat = jointBinding.parentBaseWorldQuat;
                const parentInitialPos = jointBinding.parentBaseWorldPos;

                const localPos = jointBinding.baseWorldPosition.clone()
                    .sub(parentInitialPos)
                    .applyQuaternion(parentInitialQuat.clone().invert());

                const localQuat = parentInitialQuat.clone()
                    .invert()
                    .multiply(jointBinding.baseWorldQuaternion);

                jointBinding.node.position.copy(localPos);
                jointBinding.node.quaternion.copy(localQuat);
            }
        }
    }

    /**
     * Reset the update counter (call when simulation restarts).
     */
    resetUpdateCounter() {
        this.updateCounter = 0;
    }

    /**
     * Clear all smoothing/interpolation state.
     */
    resetSmoothing() {
        this.currentServoAngles.clear();
        this.targetServoAngles.clear();
        this.lastUpdateTimestampMs = null;
    }
}

export default KinematicsEngine;
