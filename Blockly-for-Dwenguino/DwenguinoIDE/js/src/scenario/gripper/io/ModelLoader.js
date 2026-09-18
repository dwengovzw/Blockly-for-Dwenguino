import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import halberdLinkageGripperAssemblyUrl from "../descriptors/cad_models/halberd_linkage_gripper_assembly.STL";

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
        this.stlLoader = new STLLoader();
        this.currentModelFile = null;
        this.currentDescriptor = null;
        this.isUsingCustomModel = false;
        this.isUsingCustomDescriptor = false;
        this.isModelReloading = false;
    }

    /**
     * Load the bundled default STL model and synthesize an articulated scene graph.
     * Falls back to the procedural demo model if STL loading fails.
     * @returns {Promise<THREE.Group>}
     */
    async loadDefaultModel() {
        try {
            const geometry = await this.stlLoader.loadAsync(halberdLinkageGripperAssemblyUrl);
            return this.createDefaultModelFromStl(geometry);
        } catch (error) {
            console.error("[ModelLoader] Failed to load bundled STL model, using procedural fallback", error);
            return this.createDefaultModel();
        }
    }

    /**
     * Build a default scene graph from the bundled STL assembly.
     * This keeps the existing runtime expectations by exposing jaw/base node names.
     *
     * @param {THREE.BufferGeometry} geometry
     * @returns {THREE.Group}
     */
    createDefaultModelFromStl(geometry) {
        const root = new THREE.Group();
        root.name = "gripper_root";

        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        // Keep compatibility with existing descriptor node lookups.
        const base = new THREE.Group();
        base.name = "base";
        const jawLeft = new THREE.Group();
        jawLeft.name = "jaw_left";
        const jawRight = new THREE.Group();
        jawRight.name = "jaw_right";

        const componentGroups = this._splitStlIntoComponents(geometry);
        const componentInfos = componentGroups.map(group => {
            const box = new THREE.Box3().setFromObject(group);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            return { group, center, size };
        });

        // Sort by triangle-heavy size proxy (volume) to identify main bodies first.
        componentInfos.sort((a, b) => {
            const va = a.size.x * a.size.y * a.size.z;
            const vb = b.size.x * b.size.y * b.size.z;
            return vb - va;
        });

        // Largest body is base assembly.
        const baseBody = componentInfos.shift();
        if (baseBody) {
            base.add(baseBody.group);
        }

        // Find two major side bodies that likely correspond to left/right moving linkage/fingers.
        const remaining = componentInfos
            .filter(info => info.size.length() > 20)
            .sort((a, b) => b.size.length() - a.size.length());

        const sideCandidates = remaining.slice(0, 2).sort((a, b) => a.center.x - b.center.x);
        if (sideCandidates[0]) {
            jawLeft.add(sideCandidates[0].group);
        }
        if (sideCandidates[1]) {
            jawRight.add(sideCandidates[1].group);
        }

        // Add all not-yet-attached components to base so nothing is dropped visually.
        const attached = new Set();
        if (baseBody) attached.add(baseBody.group.uuid);
        if (sideCandidates[0]) attached.add(sideCandidates[0].group.uuid);
        if (sideCandidates[1]) attached.add(sideCandidates[1].group.uuid);
        componentInfos.forEach(info => {
            if (!attached.has(info.group.uuid)) {
                base.add(info.group);
            }
        });

        root.add(base);
        root.add(jawLeft);
        root.add(jawRight);

        // Center and orient root after grouping.
        const bbox = new THREE.Box3().setFromObject(root);
        if (!bbox.isEmpty()) {
            const center = bbox.getCenter(new THREE.Vector3());
            const yOffset = -bbox.min.y;
            root.position.set(-center.x, yOffset, -center.z);
        } else {
            root.position.set(0, 0, 0);
        }
        root.rotation.x = -Math.PI / 2;

        return root;
    }

    /**
     * Split a (likely non-indexed) STL buffer geometry into disconnected components.
     *
     * @param {THREE.BufferGeometry} geometry
     * @returns {THREE.Group[]} Component groups each containing one mesh
     */
    _splitStlIntoComponents(geometry) {
        const src = geometry.index ? geometry.toNonIndexed() : geometry;
        const position = src.getAttribute("position");
        const normal = src.getAttribute("normal");
        const triCount = position.count / 3;

        const keyFor = (x, y, z) => `${Math.round(x * 1000)},${Math.round(y * 1000)},${Math.round(z * 1000)}`;
        const vertexToTriangles = new Map();

        for (let t = 0; t < triCount; t++) {
            for (let v = 0; v < 3; v++) {
                const i = t * 3 + v;
                const k = keyFor(position.getX(i), position.getY(i), position.getZ(i));
                if (!vertexToTriangles.has(k)) vertexToTriangles.set(k, []);
                vertexToTriangles.get(k).push(t);
            }
        }

        const visited = new Uint8Array(triCount);
        const components = [];

        for (let start = 0; start < triCount; start++) {
            if (visited[start]) continue;

            const queue = [start];
            visited[start] = 1;
            const tris = [];

            while (queue.length) {
                const t = queue.pop();
                tris.push(t);
                for (let v = 0; v < 3; v++) {
                    const i = t * 3 + v;
                    const k = keyFor(position.getX(i), position.getY(i), position.getZ(i));
                    const neigh = vertexToTriangles.get(k) || [];
                    for (const nt of neigh) {
                        if (!visited[nt]) {
                            visited[nt] = 1;
                            queue.push(nt);
                        }
                    }
                }
            }

            const compPositions = new Float32Array(tris.length * 9);
            const compNormals = normal ? new Float32Array(tris.length * 9) : null;

            let w = 0;
            for (const t of tris) {
                for (let v = 0; v < 3; v++) {
                    const i = t * 3 + v;
                    compPositions[w] = position.getX(i);
                    compPositions[w + 1] = position.getY(i);
                    compPositions[w + 2] = position.getZ(i);
                    if (compNormals) {
                        compNormals[w] = normal.getX(i);
                        compNormals[w + 1] = normal.getY(i);
                        compNormals[w + 2] = normal.getZ(i);
                    }
                    w += 3;
                }
            }

            const g = new THREE.BufferGeometry();
            g.setAttribute("position", new THREE.BufferAttribute(compPositions, 3));
            if (compNormals) {
                g.setAttribute("normal", new THREE.BufferAttribute(compNormals, 3));
            } else {
                g.computeVertexNormals();
            }

            const mesh = new THREE.Mesh(
                g,
                new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.2, roughness: 0.6 })
            );
            mesh.name = `halberd_component_${components.length}`;

            const group = new THREE.Group();
            group.name = `halberd_component_group_${components.length}`;
            group.add(mesh);
            components.push(group);
        }

        return components;
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
                    modelRoot = await this.loadDefaultModel();
                }
            } else {
                console.log('[ModelLoader] Reloading default model');
                modelRoot = await this.loadDefaultModel();
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
}

export default ModelLoader;
