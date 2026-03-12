import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Handles loading, storing, and reloading of 3D models and kinematics descriptors.
 * Supports both custom GLB uploads and a default procedural gripper model.
 */
class ModelLoader {
    /** @type {GLTFLoader} */
    gltfLoader = null;
    /** @type {File|null} Currently loaded custom model file */
    currentModelFile = null;
    /** @type {Object|null} Currently loaded custom descriptor (deep copy) */
    currentDescriptor = null;
    /** @type {boolean} Whether a custom model is loaded */
    isUsingCustomModel = false;
    /** @type {boolean} Whether a custom descriptor is loaded */
    isUsingCustomDescriptor = false;
    /** @type {boolean} True while an async model reload is in progress */
    isModelReloading = false;

    constructor() {
        this.gltfLoader = new GLTFLoader();

        // Setup DRACOLoader for compressed GLB files
        try {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
            this.gltfLoader.setDRACOLoader(dracoLoader);
            console.log('[ModelLoader] DRACOLoader configured for compressed GLB files');
        } catch (error) {
            console.warn('[ModelLoader] DRACOLoader not available:', error);
        }
    }

    /**
     * Load a GLB model from a File object.
     * @param {File} file - GLB file to load
     * @returns {Promise<THREE.Group>} Loaded model scene
     */
    loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            this.gltfLoader.load(
                url,
                (gltf) => {
                    URL.revokeObjectURL(url);
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    URL.revokeObjectURL(url);
                    reject(error);
                }
            );
        });
    }

    /**
     * Handle user upload of a custom GLB model.
     * Stores the file for later reloading and loads the model.
     * @param {Event} event - File input change event
     * @param {function(THREE.Group): void} onModelLoaded - Callback when model is loaded
     */
    handleModelUpload(event, onModelLoaded) {
        let file = event.target.files[0];
        if (!file) return;

        console.log(`[ModelLoader] Loading GLB model: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

        this.currentModelFile = file;
        this.isUsingCustomModel = true;

        let url = URL.createObjectURL(file);
        this.gltfLoader.load(
            url,
            (gltf) => {
                URL.revokeObjectURL(url);
                console.log(`[ModelLoader] Successfully loaded GLB model: ${file.name}`);
                onModelLoaded(gltf.scene);
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`[ModelLoader] Loading: ${percentComplete}%`);
            },
            (error) => {
                URL.revokeObjectURL(url);

                let errorMessage = `Failed to load GLB model: ${file.name}\n\n`;
                if (error.message && error.message.includes('DRACOLoader')) {
                    errorMessage += 'The GLB file appears to be DRACO-compressed. ';
                    errorMessage += 'DRACOLoader is configured, but decompression may have failed.\n\n';
                    errorMessage += 'Try re-exporting from SolidWorks without DRACO compression:\n';
                    errorMessage += '1. File > Save As > GLTF Binary (.glb)\n';
                    errorMessage += '2. Click Options and disable "DRACO compression"\n';
                    errorMessage += '3. Save and try uploading again';
                } else {
                    errorMessage += 'Error details:\n' + error.message;
                }

                console.error(`[ModelLoader] ${errorMessage}`, error);
                alert(errorMessage);
                this.isUsingCustomModel = false;
            }
        );
    }

    /**
     * Handle user upload of a custom JSON kinematics descriptor.
     * @param {Event} event - File input change event
     * @param {function(Object): void} onDescriptorLoaded - Callback with parsed descriptor
     */
    handleKinematicsUpload(event, onDescriptorLoaded) {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = () => {
            try {
                let parsed = JSON.parse(reader.result);
                this.currentDescriptor = JSON.parse(JSON.stringify(parsed));
                this.isUsingCustomDescriptor = true;
                console.log(`[ModelLoader] Successfully loaded kinematics descriptor: ${file.name}`);
                onDescriptorLoaded(parsed);
            } catch (error) {
                console.error("Invalid kinematics JSON", error);
                alert(`Failed to parse kinematics JSON: ${error.message}`);
                this.isUsingCustomDescriptor = false;
            }
        };
        reader.readAsText(file);
    }

    /**
     * Create the default procedural gripper model using Three.js primitives.
     * @returns {THREE.Group} The root group containing the gripper model
     */
    createDefaultModel() {
        let group = new THREE.Group();
        group.name = "gripper_root";

        let material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.2, roughness: 0.6 });

        // Base platform
        let base = new THREE.Mesh(new THREE.BoxGeometry(120, 20, 60), material);
        base.position.set(0, 10, 0);
        base.name = "base";
        group.add(base);

        let jawMaterial = new THREE.MeshStandardMaterial({ color: 0x4a9234, metalness: 0.2, roughness: 0.5 });
        let jawGeometry = new THREE.BoxGeometry(50, 10, 20);

        // Left jaw
        let leftPivot = new THREE.Group();
        leftPivot.name = "jaw_left";
        leftPivot.position.set(-30, 20, 0);
        let leftJaw = new THREE.Mesh(jawGeometry, jawMaterial);
        leftJaw.position.set(-25, 0, 0);
        leftPivot.add(leftJaw);

        // Right jaw
        let rightPivot = new THREE.Group();
        rightPivot.name = "jaw_right";
        rightPivot.position.set(30, 20, 0);
        let rightJaw = new THREE.Mesh(jawGeometry, jawMaterial);
        rightJaw.position.set(25, 0, 0);
        rightPivot.add(rightJaw);

        group.add(leftPivot);
        group.add(rightPivot);

        return group;
    }

    /**
     * Reload model and descriptor from stored sources.
     * Sets isModelReloading flag to prevent state updates during reload.
     *
     * @param {Object} defaultDescriptor - Default descriptor to use if no custom one is loaded
     * @param {function(THREE.Object3D, Object): void} onReloaded - Callback with (modelRoot, descriptor)
     * @returns {Promise<void>}
     */
    async reload(defaultDescriptor, onReloaded) {
        this.isModelReloading = true;
        console.log('[ModelLoader] Starting model and descriptor reload...');

        try {
            let modelRoot;

            if (this.isUsingCustomModel && this.currentModelFile) {
                console.log('[ModelLoader] Reloading custom model');
                try {
                    modelRoot = await this.loadFromFile(this.currentModelFile);
                    console.log('[ModelLoader] Custom model reloaded');
                } catch (error) {
                    console.error('[ModelLoader] Failed to reload custom model:', error);
                    modelRoot = this.createDefaultModel();
                }
            } else {
                console.log('[ModelLoader] Reloading default model');
                modelRoot = this.createDefaultModel();
            }

            let descriptor;
            if (this.isUsingCustomDescriptor && this.currentDescriptor) {
                console.log('[ModelLoader] Reloading custom descriptor');
                descriptor = JSON.parse(JSON.stringify(this.currentDescriptor));
            } else {
                console.log('[ModelLoader] Reloading default descriptor');
                descriptor = JSON.parse(JSON.stringify(defaultDescriptor));
            }

            onReloaded(modelRoot, descriptor);
            console.log('[ModelLoader] Model reload complete');
        } finally {
            this.isModelReloading = false;
        }
    }

    /**
     * Reset to default model and descriptor state.
     */
    resetToDefaults() {
        this.currentModelFile = null;
        this.currentDescriptor = null;
        this.isUsingCustomModel = false;
        this.isUsingCustomDescriptor = false;
    }
}

export default ModelLoader;
