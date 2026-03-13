import DwenguinoSimulationScenario from "../dwenguino_simulation_scenario.js";
import DEFAULT_KINEMATICS_DESCRIPTOR from "./default_descriptor.js";
import ReferenceGeometry from "./ReferenceGeometry.js";
import ConstraintSolver from "./ConstraintSolver.js";
import KinematicsEngine from "./KinematicsEngine.js";
import ThreeSceneManager from "./ThreeSceneManager.js";
import GripperControlPanel from "./GripperControlPanel.js";
import ModelLoader from "./ModelLoader.js";
import TouchSensorManager from "./TouchSensorManager.js";
import GraspableObject from "./GraspableObject.js";
import * as THREE from "three";

/**
 * Gripper simulation scenario that renders a 3D robot gripper controlled by servo motors.
 *
 * Orchestrates sub-modules:
 * - ThreeSceneManager: Three.js scene, camera, renderer, animation loop
 * - ModelLoader: GLB/GLTF loading, procedural default model, reload
 * - ReferenceGeometry: per-part reference points and planes
 * - KinematicsEngine: servo-to-joint mapping, smoothing, pose reset
 * - ConstraintSolver: iterative mechanical constraint solving
 * - GripperControlPanel: UI for model/descriptor uploads and reset
 */
class DwenguinoSimulationScenarioGripper extends DwenguinoSimulationScenario {
    container = null;
    modelRoot = null;
    kinematicsDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));

    // Sub-modules (field initializers are evaluated in declaration order)
    sceneManager = new ThreeSceneManager();
    refGeometry = new ReferenceGeometry();
    constraintSolver = new ConstraintSolver(this.refGeometry);
    kinematicsEngine = new KinematicsEngine(this.refGeometry);
    controlPanel = new GripperControlPanel();
    modelLoader = new ModelLoader();
    touchSensorManager = new TouchSensorManager(this.refGeometry);
    graspableObject = new GraspableObject();

    constructor(logger, name) {
        super(logger, name);
    }

    initSimulationState(boardState) {
        super.initSimulationState(boardState);
        this.updateScenarioState(boardState);
    }

    initSimulationDisplay(containerId) {
        super.initSimulationDisplay(containerId);
        this.container = $(`#${containerId}`);
        this.container.css({ position: "relative" });

        this.sceneManager.init(this.container);

        this.controlPanel.setup(this.container, {
            onModelUpload: (event) => this._handleModelUpload(event),
            onKinematicsUpload: (event) => this._handleKinematicsUpload(event),
            onReset: () => this._handleReset(),
            onToggleGraspableObject: (visible) => this.graspableObject.setVisible(visible),
            onGraspableShapeChange: (shape) => this.graspableObject.setShape(shape, this.graspableObject.size),
            onGraspableSizeChange: (size) => this.graspableObject.setShape(this.graspableObject.shape, size),
            onResetGraspableObject: () => this.graspableObject.resetPosition()
        });

        let defaultModel = this.modelLoader.createDefaultModel();
        this._setModel(defaultModel);
        this.kinematicsEngine.seedServoAnglesFromDescriptor(this.kinematicsDescriptor);
        this.kinematicsEngine.resetUpdateCounter();
        this.sceneManager.render();
        this.sceneManager.startAnimationLoop();
    }

    /**
     * Replace the current 3D model and apply the kinematics descriptor.
     */
    _setModel(modelRoot) {
        if (!this.sceneManager.scene) {
            console.warn('[Gripper] setModel called after scene destroyed');
            return;
        }
        this.sceneManager.setModel(modelRoot, this.modelRoot);
        this.modelRoot = modelRoot;
        this.sceneManager.applyModelTransform(modelRoot, this.kinematicsDescriptor?.model?.upAxis);
        this.refGeometry.setModelRoot(modelRoot);
        this._applyFullDescriptor();
        this.sceneManager.fitCameraToModel(modelRoot);
    }

    /**
     * Apply the kinematics descriptor: build reference geometry, bind joints, and initialize constraints.
     */
    _applyFullDescriptor() {
        const solverConfig = this.kinematicsDescriptor?.constraintSolver;

        this.refGeometry.buildPartsCache(this.kinematicsDescriptor);

        if (solverConfig?.referencePointScale) {
            this.refGeometry.setReferencePointScale(solverConfig.referencePointScale);
        }

        this.kinematicsEngine.bindJoints(this.kinematicsDescriptor, this.modelRoot);
        this.constraintSolver.initialize(this.kinematicsDescriptor, this.modelRoot);

        // Propagate instantMotion from solver config to kinematics engine
        // (originally a single shared property on the class)
        this.kinematicsEngine.instantMotion = this.constraintSolver.instantMotion;

        // Handle reference point visualization
        if (solverConfig?.showReferencePoints) {
            this.refGeometry.visualizeReferencePoints(this.sceneManager.scene, this.kinematicsDescriptor);
        } else {
            this.refGeometry.hideReferencePoints(this.sceneManager.scene);
        }

        // Initialize touch sensors from descriptor
        this.touchSensorManager.initialize(
            this.kinematicsDescriptor, this.modelRoot, this.sceneManager.scene
        );

        // Initialize graspable object
        const objDef = this.kinematicsDescriptor?.graspableObject;
        if (objDef) {
            const spawnPos = objDef.spawnPosition
                ? { x: objDef.spawnPosition[0], y: objDef.spawnPosition[1], z: objDef.spawnPosition[2] }
                : undefined;
            this.graspableObject.initialize(this.sceneManager.scene, {
                shape: objDef.shape || "sphere",
                size: objDef.size || 0.015,
                spawnPosition: spawnPos
                    ? new THREE.Vector3(spawnPos.x, spawnPos.y, spawnPos.z)
                    : undefined
            });
        }
    }

    _handleModelUpload(event) {
        this.modelLoader.handleModelUpload(event, (modelScene) => {
            this._setModel(modelScene);
            this.kinematicsEngine.seedServoAnglesFromDescriptor(this.kinematicsDescriptor);
            this.kinematicsEngine.resetUpdateCounter();
            this.sceneManager.render();
        });
    }

    _handleKinematicsUpload(event) {
        this.modelLoader.handleKinematicsUpload(event, (parsed) => {
            this.kinematicsDescriptor = parsed;
            this.sceneManager.applyModelTransform(this.modelRoot, parsed?.model?.upAxis);
            this._applyFullDescriptor();
            this.kinematicsEngine.seedServoAnglesFromDescriptor(parsed);
            this.kinematicsEngine.resetUpdateCounter();
            this.sceneManager.render();
        });
    }

    _handleReset() {
        this.kinematicsDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
        this.modelLoader.resetToDefaults();
        let defaultModel = this.modelLoader.createDefaultModel();
        this._setModel(defaultModel);
        this.sceneManager.render();
    }

    updateScenario(boardState) {
        if (this.modelLoader.isModelReloading) {
            return;
        }
        super.updateScenario(boardState);
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
    }

    updateScenarioState(boardState) {
        if (this.modelLoader.isModelReloading) {
            return;
        }
        super.updateScenarioState(boardState);
        this.kinematicsEngine.updateTargetServoAngles(boardState);
        this.kinematicsEngine.updateSmoothedServoAngles();
        this.kinematicsEngine.applyServoState(boardState);
        this.constraintSolver.solve();

        // Update touch sensors after constraints are solved (positions are final)
        this.touchSensorManager.update(this.graspableObject);
        this.touchSensorManager.writeToBoard(boardState);

        // Update graspable object physics
        const contacts = this.touchSensorManager.getContactInfo();
        this.graspableObject.update(1 / 60, contacts);
    }

    updateScenarioDisplay(boardState) {
        super.updateScenarioDisplay(boardState);
        this.sceneManager.render();
    }

    resetScenario() {
        super.resetScenario();
        this.kinematicsEngine.resetSmoothing();
        this.kinematicsEngine.resetUpdateCounter();

        this.modelLoader.reload(DEFAULT_KINEMATICS_DESCRIPTOR, (modelRoot, descriptor) => {
            this.kinematicsDescriptor = descriptor;
            this._setModel(modelRoot);
            this.kinematicsEngine.seedServoAnglesFromDescriptor(descriptor);
        }).then(() => {
            this.sceneManager.render();
            console.log('[Gripper] Reset complete');
        }).catch(error => {
            console.error('[Gripper] Error during reset:', error);
            this.sceneManager.render();
        });
    }

    setIsSimulationRunning(isSimulationRunning) {
        this.isSimulationRunning = isSimulationRunning;
    }

    destroy() {
        this.touchSensorManager.cleanup(this.sceneManager.scene);
        this.graspableObject.cleanup();
        this.sceneManager.destroy();
    }
}

export default DwenguinoSimulationScenarioGripper;
