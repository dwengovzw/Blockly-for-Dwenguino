import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Manages the Three.js scene infrastructure: scene, camera, renderer, lights,
 * orbit controls, resize handling, and animation loop.
 */
class ThreeSceneManager {
    /** @type {JQuery} DOM container element */
    container = null;
    /** @type {THREE.WebGLRenderer} */
    renderer = null;
    /** @type {THREE.Scene} */
    scene = null;
    /** @type {THREE.PerspectiveCamera} */
    camera = null;
    /** @type {OrbitControls} */
    controls = null;
    /** @type {ResizeObserver} */
    resizeObserver = null;
    /** @type {number|null} Animation frame request ID */
    animationLoopId = null;

    /**
     * Initialize the Three.js scene inside a DOM container.
     * Sets up the renderer, camera, lights, grid, axes, and orbit controls.
     * @param {JQuery} container - jQuery-wrapped container element
     */
    init(container) {
        this.container = container;

        let width = container.width();
        let height = container.height();

        // Create scene with light gray background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);

        // Setup perspective camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        this.camera.position.set(0, 140, 260);
        this.camera.lookAt(0, 40, 0);

        // Create WebGL renderer with antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.left = "0";
        this.renderer.domElement.style.top = "0";
        container.append(this.renderer.domElement);

        // Lighting
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(150, 200, 100);
        this.scene.add(ambientLight, directionalLight);

        // Ground grid
        let grid = new THREE.GridHelper(400, 20, 0xcccccc, 0xdddddd);
        grid.position.y = 0;
        this.scene.add(grid);

        // Axes helper
        let axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);

        // Orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.target.set(0, 40, 0);
        this.controls.update();

        // Watch for container size changes
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(container[0]);
    }

    /**
     * Add a model root to the scene, removing any previous model.
     * @param {THREE.Object3D} newModelRoot - The model to add
     * @param {THREE.Object3D|null} oldModelRoot - The previous model to remove (and dispose)
     * @returns {void}
     */
    setModel(newModelRoot, oldModelRoot) {
        if (!this.scene) {
            console.warn('[ThreeSceneManager] setModel called after scene destroyed');
            return;
        }

        if (oldModelRoot) {
            this.scene.remove(oldModelRoot);
            oldModelRoot.traverse((node) => {
                if (node.geometry) node.geometry.dispose();
                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(mat => mat.dispose());
                    } else {
                        node.material.dispose();
                    }
                }
            });
        }

        this.scene.add(newModelRoot);
    }

    /**
     * Apply model-level axis transformations (Y-up vs Z-up).
     * @param {THREE.Object3D} modelRoot
     * @param {string} upAxis - "Y" or "Z"
     */
    applyModelTransform(modelRoot, upAxis) {
        if (!modelRoot) return;
        if (upAxis?.toUpperCase() === "Z") {
            modelRoot.rotation.set(-Math.PI / 2, 0, 0);
        } else {
            modelRoot.rotation.set(0, 0, 0);
        }
    }

    /**
     * Auto-fit camera to frame the entire model.
     * @param {THREE.Object3D} modelRoot
     */
    fitCameraToModel(modelRoot) {
        if (!modelRoot) return;

        const box = new THREE.Box3().setFromObject(modelRoot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log(`[ThreeSceneManager] Model loaded:`, {
            center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
            size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
            boundingSphere: box.getBoundingSphere(new THREE.Sphere()).radius.toFixed(2)
        });

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraDistance *= 1.5;

        const direction = new THREE.Vector3(0, 0.3, 1).normalize();
        this.camera.position.copy(direction.multiplyScalar(cameraDistance).add(center));
        this.camera.lookAt(center);

        this.controls.target.copy(center);
        this.controls.update();

        console.log(`[ThreeSceneManager] Camera auto-fitted to model`);
        this.render();
    }

    /**
     * Render a single frame.
     */
    render() {
        if (!this.renderer || !this.scene || !this.camera) return;
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Start the continuous animation loop for smooth orbit controls and rendering.
     */
    startAnimationLoop() {
        const animationFrame = () => {
            this.render();
            this.animationLoopId = requestAnimationFrame(animationFrame);
        };
        this.animationLoopId = requestAnimationFrame(animationFrame);
    }

    /**
     * Stop the continuous animation loop.
     */
    stopAnimationLoop() {
        if (this.animationLoopId !== null) {
            cancelAnimationFrame(this.animationLoopId);
            this.animationLoopId = null;
        }
    }

    /**
     * Handle container resize events.
     */
    handleResize() {
        if (!this.renderer || !this.camera) return;
        let width = this.container.width();
        let height = this.container.height();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.render();
    }

    /**
     * Cleanup and dispose all Three.js resources.
     */
    destroy() {
        this.stopAnimationLoop();

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
            this.renderer = null;
        }

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            this.scene = null;
        }

        this.camera = null;

        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
    }
}

export default ThreeSceneManager;
