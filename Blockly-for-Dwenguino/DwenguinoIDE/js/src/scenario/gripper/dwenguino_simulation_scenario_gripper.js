import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DwenguinoSimulationScenario from "../dwenguino_simulation_scenario.js";

/**
 * Default kinematics descriptor that maps servo angles to 3D model joint rotations.
 * This descriptor defines:
 * - Model properties (scale, axis orientation)
 * - Part definitions with reference geometry (points, planes) in local coordinates
 * - Joint definitions with their rotation axes, angle ranges, and servo mappings
 * - Constraints between parts using reference geometry (e.g. keep grip faces parallel)
 * 
 * The descriptor allows for extensibility - users can upload custom JSON files
 * to define different gripper configurations, servo mappings, and mechanical constraints.
 * Reference points/planes are defined in local coordinates relative to each part.
 */
const DEFAULT_KINEMATICS_DESCRIPTOR = {
    version: 1,
    model: {
        upAxis: "Y"
    },
    parts: [
        {
            name: "jaw_left",
            referencePoints: {
                pivot: { x: -30, y: 20, z: 0 },
                gripPoint: { x: -55, y: 20, z: 0 }
            },
            referencePlanes: {}
        },
        {
            name: "jaw_right",
            referencePoints: {
                pivot: { x: 30, y: 20, z: 0 },
                gripPoint: { x: 55, y: 20, z: 0 }
            },
            referencePlanes: {}
        },
        {
            name: "base",
            referencePoints: {},
            referencePlanes: {}
        }
    ],
    joints: [
        {
            name: "jaw_left",
            node: "jaw_left",
            type: "revolute",
            axis: [0, 0, -1],
            axisPoint: "pivot",
            minDeg: 0,
            maxDeg: 180,
            servo: {
                index: 1,
                min: 180,
                max: 0,
                invert: false
            }
        },
        {
            name: "jaw_right",
            node: "jaw_right",
            type: "revolute",
            axis: [0, 0, 1],
            axisPoint: "pivot",
            minDeg: 0,
            maxDeg: 180,
            servo: {
                index: 2,
                min: 0,
                max: 180,
                invert: true
            }
        }
    ],
    constraints: [],
    // Constraint solver configuration
    constraintSolver: {
        maxIterations: 10,              // Maximum solver iterations per frame
        convergenceThreshold: 0.001,    // Convergence threshold (radians/units)
        enableConflictDetection: true,  // Warn about conflicting constraints
        showReferencePoints: false,     // Visualize reference points for debugging
        referencePointScale: 1.0        // Scale factor for reference point coordinates (e.g., 0.1 if GLB is in cm but descriptors are in mm)
    }
};

/**
 * Gripper simulation scenario that renders a 3D robot gripper controlled by servo motors.
 * 
 * Architecture:
 * - Microcontroller State (BoardState) provides servo angles
 * - Kinematic Mapping Layer (kinematicsDescriptor) maps servos to joints
 * - 3D Simulation Engine (Three.js) renders the animated gripper
 * - Users can upload custom GLB models and JSON kinematic descriptors
 */
class DwenguinoSimulationScenarioGripper extends DwenguinoSimulationScenario {
    // DOM container element for the simulation
    container = null;
    // Three.js WebGL renderer
    renderer = null;
    // Three.js scene containing all 3D objects
    scene = null;
    // Three.js perspective camera
    camera = null;
    // Orbit controls for mouse-based camera rotation
    controls = null;
    // GLTF/GLB model loader
    gltfLoader = null;
    // Root node of the loaded 3D model
    modelRoot = null;
    // Array of joint bindings (descriptor + Three.js node + base rotation)
    joints = [];
    // Array of SolidWorks constraints resolved from descriptor
    constraints = [];
    // Constraint solver configuration
    maxConstraintIterations = 10;
    convergenceThreshold = 0.001;
    enableConflictDetection = true;
    instantMotion = true;
    constraintGainScale = 1.0;
    translationWeight = 1.0;
    rotationWeight = 1.0;
    maxLinearStep = 0.0;
    maxAngularStep = 0.0;
    // Scale factor for reference point coordinates
    referencePointScale = 1.0;
    // Array of detected constraint conflicts
    constraintConflicts = [];
    // Current kinematics configuration (deep copy to avoid mutation)
    kinematicsDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
    // ResizeObserver to handle container size changes
    resizeObserver = null;
    // Track current and target servo angles for smooth transitions
    currentServoAngles = new Map();
    targetServoAngles = new Map();
    // Timestamp of last update for time-based interpolation
    lastUpdateTimestampMs = null;
    // Maximum servo speed in degrees per second (tweak for smoother/faster motion)
    servoSpeedDegPerSec = 120;
    // Animation loop ID for continuous rendering
    animationLoopId = null;
    // Cache of part definitions indexed by name for quick lookup
    partsCache = new Map();
    // Cache of reference point world coordinates, keyed as "partName:pointName"
    referencePointsCache = new Map();
    // Visualization of reference points (for debugging)
    referencePointVisualization = null;
    showReferencePoints = false;
    // Store the currently loaded model (THREE.Group or cloneable object)
    currentModelRoot = null;
    // Store the currently loaded descriptor
    currentDescriptor = null;
    // Store the currently loaded model file for reloading
    currentModelFile = null;
    // Flag to track if using custom or default model
    isUsingCustomModel = false;
    // Flag to track if using custom or default descriptor
    isUsingCustomDescriptor = false;
    // Flag to prevent state updates while async model reload is in progress
    isModelReloading = false;
    // Counter to track simulation updates (used to filter out initialization glitches)
    updateCounter = 0;
    // Number of updates to skip before applying servo state (prevents initial zero-angle glitch)
    initializationSkipCount = 4;

    /**
     * Initialize the gripper simulation scenario.
     * @param {Object} logger - Logger instance for tracking events
     * @param {string} name - Name identifier for this scenario
     */
    constructor(logger, name) {
        super(logger, name);
        // Initialize the GLTF loader for loading 3D models
        this.gltfLoader = new GLTFLoader();
    }

    /**
     * Initialize the simulation state from the board state.
     * Called when the simulation is reset or first loaded.
     * @param {BoardState} boardState - The state of the Dwenguino board containing servo positions
     */
    initSimulationState(boardState) {
        super.initSimulationState(boardState);
        // Apply the current board state to update joint positions
        this.updateScenarioState(boardState);
    }

    /**
     * Initialize the 3D display for the gripper simulation.
     * Sets up the Three.js scene, camera, lighting, and UI controls.
     * @param {string} containerId - DOM element ID where the simulation will be rendered
     */
    initSimulationDisplay(containerId) {
        super.initSimulationDisplay(containerId);
        this.container = $(`#${containerId}`);
        this.container.css({ position: "relative" });

        // Setup Three.js scene with camera, lights, and grid
        this.setupThreeScene();
        // Add control panel for uploading models and kinematics
        this.setupControlPanel();

        // Load the default procedural gripper model
        this.loadDefaultModel();
        // Seed initial servo angles to prevent glitch when simulation starts
        this.seedServoAnglesFromDescriptor();
        // Reset update counter for initial run
        this.updateCounter = 0;
        // Render the initial frame
        this.renderScene();

        // Watch for container size changes to update renderer/camera
        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        this.resizeObserver.observe(document.querySelector(`#${containerId}`));

        // Start continuous animation loop for rendering and orbit controls
        this.startAnimationLoop();
    }

    /**
     * Start the continuous animation loop for rendering and orbit controls.
     * This ensures the 3D view updates smoothly even when the simulation is not running.
     */
    startAnimationLoop() {
        const animationFrame = () => {
            this.renderScene();
            this.animationLoopId = requestAnimationFrame(animationFrame);
        };
        this.animationLoopId = requestAnimationFrame(animationFrame);
    }

    /**
     * Stop the continuous animation loop.
     * Should be called when the scenario is destroyed or cleaned up.
     */
    stopAnimationLoop() {
        if (this.animationLoopId !== null) {
            cancelAnimationFrame(this.animationLoopId);
            this.animationLoopId = null;
        }
    }

    /**
     * Setup the Three.js scene with camera, renderer, lights, and ground grid.
     * Creates the 3D environment where the gripper will be displayed.
     */
    setupThreeScene() {
        let width = this.container.width();
        let height = this.container.height();

        // Create scene with light gray background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);

        // Setup perspective camera with 45° FOV, positioned to view the gripper
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
        this.container.append(this.renderer.domElement);

        // Add lighting: ambient light for general illumination + directional for shadows/depth
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(150, 200, 100);
        this.scene.add(ambientLight, directionalLight);

        // Add ground grid for spatial reference
        let grid = new THREE.GridHelper(400, 20, 0xcccccc, 0xdddddd);
        grid.position.y = 0;
        this.scene.add(grid);

        // Add axes helper to visualize X (red), Y (green), Z (blue) directions
        // Size is 200 units, making it visible in the 3D view
        let axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);

        // Setup orbit controls for mouse-based camera rotation
        // Drag to rotate, right-click drag or middle-click to pan, scroll to zoom
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // Smooth rotation with inertia
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false; // Can be set to true for automatic rotation
        this.controls.target.set(0, 40, 0); // Point controls look at (same as camera.lookAt)
        this.controls.update();

        // Setup DRACOLoader for compressed GLB files from SolidWorks
        // This allows loading GLB files that use DRACO compression
        try {
            const dracoLoader = new DRACOLoader();
            // Set the decoder path - adjust based on your deployment setup
            // The draco files are from Three.js library
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
            this.gltfLoader.setDRACOLoader(dracoLoader);
            console.log('[Gripper] DRACOLoader configured for compressed GLB files');
        } catch (error) {
            console.warn('[Gripper] DRACOLoader not available, compressed GLB files may fail to load:', error);
        }
    }

    /**
     * Create and setup the control panel UI for uploading custom models and kinematics.
     * The panel allows users to:
     * - Upload custom GLB 3D models
     * - Upload custom JSON kinematic descriptors with servo mappings, reference geometry, and constraints
     * - Reset to the default gripper configuration
     * 
     * KINEMATICS DESCRIPTOR FORMAT:
     * {
     *   "version": 1,
     *   "model": { "upAxis": "Y" },
     *   "parts": [
     *     {
     *       "name": "jaw_left",
     *       "referencePoints": {
     *         "pivot": { "x": -30, "y": 20, "z": 0 },
     *         "gripSurface": { "x": -55, "y": 20, "z": 0 }
     *       },
     *       "referencePlanes": {
     *         "gripFace": { "normal": [0, 1, 0], "point": [-55, 20, 0] }
     *       }
     *     }
     *   ],
     *   "joints": [
     *     {
     *       "name": "jaw_left",
     *       "node": "jaw_left",
     *       "axis": [0, 0, -1],
     *       "axisPoint": "pivot",
     *       "minDeg": 0,
     *       "maxDeg": 180,
     *       "servo": { "index": 1, "min": 180, "max": 0 }
     *     }
     *   ],
     *   "constraints": [...],
     *   "constraintSolver": { "maxIterations": 10, "convergenceThreshold": 0.001 }
     * }
     *
     * REFERENCE GEOMETRY (per-part):
     * - referencePoints: Named points defined in LOCAL coordinates (relative to part node)
     *   Example: "pivot": { "x": -30, "y": 20, "z": 0 } means 30 units left, 20 up, in part's own frame
     * - referencePlanes: Named planes with normal vector and point in LOCAL coordinates
     * - Coordinates are automatically converted to world space during constraint solving
     * - Parts are matched by GLB node name, reference points must exist on that part
     *
     * JOINT DEFINITION WITH ARBITRARY ROTATION AXES:
     * - axisPoint: Where the rotation axis passes through
     *   - Can be string reference point name: "axisPoint": "pivot"
     *   - Can be explicit local coords: "axisPoint": { "x": 0, "y": 5, "z": 0 }
     *   - Enables rotation around arbitrary points (not just part origin)
     *   - Part will rotate around this point, not its local origin
     *
    * CONSTRAINTS WITH REFERENCE GEOMETRY:
    * {
    *   "id": "align_grip_faces",
    *   "type": "PlaneParallel",
    *   "entities": [
    *     { "name": "jaw_left",  "referencePlane": "gripFace" },
    *     { "name": "jaw_right", "referencePlane": "gripFace" }
    *   ],
    *   "weight": 1.0,
    *   "description": "Keep grip surfaces parallel"
    * }
    *
    * FIXED JOINT CONSTRAINT (pivot with optional rotation plane):
    * {
    *   "id": "lever_fixed_joint",
    *   "type": "FixedJoint",
    *   "entities": [
    *     { "name": "lever-1", "referencePoint": "pivot_right", "referencePlane": "side_front", "weight": 1.0 }
    *   ],
    *   "value": { "planeNormal": [0, 0, 1], "planePoint": [0, 0, 0] },
    *   "weight": 1.0,
    *   "description": "Fix pivot point in place, allow rotation in plane"
    * }
    *
    * JOINT CONSTRAINT (plane + coincident/offset along plane normal):
    * {
    *   "id": "arm_joint",
    *   "type": "Joint",
    *   "entities": [
    *     { "name": "arm-1", "referencePoint": "pivot_right", "referencePlane": "side_front", "weight": 0.5 },
    *     { "name": "arm-2", "referencePoint": "pivot_left",  "referencePlane": "side_front", "weight": 0.5 }
    *   ],
    *   "value": { "planeNormal": [0, 0, 1], "offset": 0.0, "coincident": true },
    *   "weight": 1.0,
    *   "description": "Hinge joint in plane with optional offset"
    * }
    * - entities: objects with { name, referencePoint?, referencePlane?, weight? }
    *   - name: Part name (GLB node name) - REQUIRED
    *   - referencePoint: Optional reference point name for measuring position
    *   - referencePlane: Optional reference plane name for measuring orientation
    *   - weight: Per-entity weight (0.0-1.0) controlling displacement distribution (default: 1.0)
    *     * 1.0 = full enforcement on this part (other parts are fixed)
    *     * 0.0 = no enforcement on this part (other parts move to satisfy constraint)
    *     * 0.5 = symmetric split of enforcement (both parts move equally)
    *     * Weights are normalized so their sum equals 1.0
    * - Constraint measures at reference geometry but moves the actual part nodes
    * - If no referencePoint/referencePlane provided, constraint uses part origin/orientation
     *
     * CONSTRAINT TYPES:
    * - Horizontal: Edge/plane is horizontal (parallel to XZ plane)
    * - Vertical: Edge/plane is vertical (parallel to Y-axis)
    * - Fixed: Fixes a part in place (position + orientation)
    * - FixedJoint: Fixes a pivot point in place, optional rotation plane
    * - Joint: Joint with plane + coincident/offset along plane normal
     *
     * CONSTRAINT WEIGHTS:
     * - weight: 0.0 to 1.0 (default: 1.0 for hard constraints)
     * - 1.0 = hard constraint (100% enforcement)
     * - 0.5 = soft constraint (50% enforcement)
     * - Higher weight = higher priority
     *
     * LEGACY DATUM SUPPORT (kept for compatibility):
     * - "datums": ["jaw_left_datum_node", "jaw_right_datum_node"]
     * - Datum nodes must exist in GLB file (created in SolidWorks)
     * - Reference points are preferred over datums (no export required)
     */
    setupControlPanel() {
        // Create floating panel in bottom-left corner
        let panel = $("<div>")
            .css({
                "position": "absolute",
                "left": "10px",
                "bottom": "10px",
                "background": "rgba(255,255,255,0.9)",
                "padding": "10px",
                "border-radius": "8px",
                "width": "260px",
                "box-shadow": "0 2px 6px rgba(0,0,0,0.15)",
                "font-size": "12px"
            });

        // GLB model upload input
        let modelLabel = $("<div>").text("GLB model");
        let modelInput = $("<input>")
            .attr("type", "file")
            .attr("accept", ".glb");
        modelInput.on("change", (event) => this.handleModelUpload(event));

        // Kinematics JSON upload input
        let kinematicsLabel = $("<div>").css({ "margin-top": "8px" }).text("Kinematics JSON");
        let kinematicsInput = $("<input>")
            .attr("type", "file")
            .attr("accept", ".json,application/json");
        kinematicsInput.on("change", (event) => this.handleKinematicsUpload(event));

        // Reset button to restore default configuration
        let resetButton = $("<button>")
            .text("Reset mapping")
            .css({ "margin-top": "8px", "width": "100%" });
        resetButton.on("click", () => {
            // Deep copy to avoid reference issues
            this.kinematicsDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
            this.currentDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
            this.isUsingCustomDescriptor = false;
            this.loadDefaultModel();
            this.applyKinematicsDescriptor();
            this.renderScene();
        });

        panel.append(modelLabel);
        panel.append(modelInput);
        panel.append(kinematicsLabel);
        panel.append(kinematicsInput);
        panel.append(resetButton);
        this.container.append(panel);
    }

    /**
     * Handle user upload of a custom GLB 3D model.
     * The model should have named nodes that match the kinematics descriptor for proper joint mapping.
     * Supports both uncompressed and DRACO-compressed GLB files.
     * Stores the file as a Blob for later reloading during reset.
     * @param {Event} event - File input change event
     */
    handleModelUpload(event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        
        console.log(`[Gripper] Loading GLB model: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        
        // Store the file blob for later reloading
        this.currentModelFile = file;
        this.isUsingCustomModel = true;
        
        // Create temporary URL for the file blob
        let url = URL.createObjectURL(file);
        this.gltfLoader.load(
            url,
            (gltf) => {
                // Clean up the temporary URL after loading
                URL.revokeObjectURL(url);
                // Store the loaded model for reset purposes
                this.currentModelRoot = gltf.scene;
                // Replace the current model with the loaded one
                this.setModel(gltf.scene);
                // Seed initial servo angles with the newly loaded model
                this.seedServoAnglesFromDescriptor();
                // Reset update counter to prevent glitch
                this.updateCounter = 0;
                console.log(`[Gripper] ✓ Successfully loaded GLB model: ${file.name}`);
            },
            (progress) => {
                // Log loading progress
                const percentComplete = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`[Gripper] Loading: ${percentComplete}%`);
            },
            (error) => {
                // Clean up URL on error
                URL.revokeObjectURL(url);
                
                // Provide helpful error messages
                let errorMessage = `✗ Failed to load GLB model: ${file.name}\n\n`;
                
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
                
                console.error(`[Gripper] ${errorMessage}`, error);
                alert(errorMessage);
                this.isUsingCustomModel = false;
            }
        );
    }

    /**
     * Handle user upload of a custom JSON kinematics descriptor.
     * The descriptor defines how servo angles map to 3D joint rotations.
     * Stores the descriptor content for later reloading during reset.
     * @param {Event} event - File input change event
     */
    handleKinematicsUpload(event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = () => {
            try {
                // Parse and apply the new kinematics configuration
                let parsed = JSON.parse(reader.result);
                this.kinematicsDescriptor = parsed;
                // Store the parsed descriptor for later reloading
                this.currentDescriptor = JSON.parse(JSON.stringify(parsed));
                this.isUsingCustomDescriptor = true;
                this.applyKinematicsDescriptor();
                // Seed initial servo angles with the newly loaded descriptor
                this.seedServoAnglesFromDescriptor();
                // Reset update counter to prevent glitch
                this.updateCounter = 0;
                this.renderScene();
                console.log(`[Gripper] ✓ Successfully loaded kinematics descriptor: ${file.name}`);
            } catch (error) {
                console.error("Invalid kinematics JSON", error);
                alert(`Failed to parse kinematics JSON: ${error.message}`);
                this.isUsingCustomDescriptor = false;
            }
        };
        reader.readAsText(file);
    }
    /**
     * Load the default procedural gripper model.
     * This ensures the simulation has a working model even without user uploads.
     */
    loadDefaultModel() {
        let defaultModel = this.createDefaultGripperModel();
        this.currentModelRoot = defaultModel;
        this.isUsingCustomModel = false;
        this.setModel(defaultModel);
    }

    /**
     * Create a default procedural gripper model using Three.js primitives.
     * The model consists of:
     * - A base platform
     * - Two jaw groups that rotate around pivot points
     * Each jaw group contains a mesh offset from its pivot for realistic gripper motion.
     * @returns {THREE.Group} The root group containing the gripper model
     */
    createDefaultGripperModel() {
        // Root group for the entire gripper assembly
        let group = new THREE.Group();
        group.name = "gripper_root";

        // Gray material for the base platform
        let material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.2, roughness: 0.6 });

        // Create base platform
        let base = new THREE.Mesh(new THREE.BoxGeometry(120, 20, 60), material);
        base.position.set(0, 10, 0);
        base.name = "base";
        group.add(base);

        // Green material for the gripper jaws
        let jawMaterial = new THREE.MeshStandardMaterial({ color: 0x4a9234, metalness: 0.2, roughness: 0.5 });
        let jawGeometry = new THREE.BoxGeometry(50, 10, 20);

        // Left jaw: pivot group rotates, jaw mesh is offset to create gripper motion
        let leftPivot = new THREE.Group();
        leftPivot.name = "jaw_left"; // Must match kinematics descriptor
        leftPivot.position.set(-30, 20, 0);
        let leftJaw = new THREE.Mesh(jawGeometry, jawMaterial);
        leftJaw.position.set(-25, 0, 0); // Offset from pivot point
        leftPivot.add(leftJaw);

        // Right jaw: mirror of left jaw
        let rightPivot = new THREE.Group();
        rightPivot.name = "jaw_right"; // Must match kinematics descriptor
        rightPivot.position.set(30, 20, 0);
        let rightJaw = new THREE.Mesh(jawGeometry, jawMaterial);
        rightJaw.position.set(25, 0, 0); // Offset from pivot point
        rightPivot.add(rightJaw);

        group.add(leftPivot);
        group.add(rightPivot);

        return group;
    }

    /**
     * Replace the current 3D model with a new one.
     * Removes the old model, applies transforms, and sets up joint mappings.
     * Automatically adjusts camera to frame the model properly.
     * @param {THREE.Object3D} modelRoot - The root node of the new model
     */
    setModel(modelRoot) {
        // Guard: if scene is destroyed, bail out silently
        if (!this.scene) {
            console.warn('[Gripper] setModel called after scene destroyed, ignoring');
            return;
        }
        
        // Remove previous model if it exists
        if (this.modelRoot) {
            this.scene.remove(this.modelRoot);
            // Dispose of old model's geometry and materials
            this.modelRoot.traverse((node) => {
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
        this.modelRoot = modelRoot;
        // Apply scale and axis transformations
        this.applyModelTransform();
        // Add to scene
        this.scene.add(this.modelRoot);
        // Map joints from kinematics descriptor to model nodes
        this.applyKinematicsDescriptor();
        
        // Auto-fit camera to frame the loaded model
        this.fitCameraToModel();
    }

    /**
     * Automatically adjust camera to frame the entire loaded model.
     * Calculates bounding box and positions camera appropriately.
     */
    fitCameraToModel() {
        if (!this.modelRoot) return;
        
        // Calculate bounding box of the model
        const box = new THREE.Box3().setFromObject(this.modelRoot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Log model info for debugging
        console.log(`[Gripper] Model loaded:`, {
            center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
            size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
            boundingSphere: box.getBoundingSphere(new THREE.Sphere()).radius.toFixed(2)
        });
        
        // Calculate distance needed to view the entire model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180); // Convert to radians
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        // Add some padding
        cameraDistance *= 1.5;
        
        // Position camera to view the model
        const direction = new THREE.Vector3(0, 0.3, 1).normalize();
        this.camera.position.copy(direction.multiplyScalar(cameraDistance).add(center));
        this.camera.lookAt(center);
        
        // Update orbit controls target
        this.controls.target.copy(center);
        this.controls.update();
        
        console.log(`[Gripper] Camera auto-fitted to model`);
        this.renderScene();
    }

    /**
     * Apply model-level transformations (axis orientation).
     * Handles different CAD export conventions (Y-up vs Z-up).
     */
    applyModelTransform() {
        if (!this.modelRoot) {
            return;
        }
        // Handle different CAD coordinate systems
        // Some CAD tools export with Z-up, Three.js uses Y-up
        let upAxis = this.kinematicsDescriptor?.model?.upAxis ?? "Y";
        if (upAxis.toUpperCase() === "Z") {
            // Rotate -90° around X to convert Z-up to Y-up
            this.modelRoot.rotation.set(-Math.PI / 2, 0, 0);
        } else {
            this.modelRoot.rotation.set(0, 0, 0);
        }
    }

    /**
     * Apply the kinematics descriptor to map joints to model nodes.
     * This creates the linkage between the kinematic definition and the 3D model.
     * For each joint in the descriptor:
     * - Find the corresponding node in the 3D model by name
     * - Store the joint descriptor, node reference, and base rotation
     * The base rotation is needed to apply relative rotations during animation.
     */
    applyKinematicsDescriptor() {
        // Clear previous caches
        this.joints = [];
        this.partsCache.clear();
        this.referencePointsCache.clear();
        
        if (!this.modelRoot || !this.kinematicsDescriptor) {
            return;
        }

        // Build parts cache from descriptor for quick reference point lookup
        if (this.kinematicsDescriptor.parts) {
            for (let partDef of this.kinematicsDescriptor.parts) {
                this.partsCache.set(partDef.name, partDef);
            }
        }

        // Ensure model transforms are current
        this.applyModelTransform();

        // Map each joint descriptor to its corresponding 3D node
        if (this.kinematicsDescriptor.joints) {
            for (let joint of this.kinematicsDescriptor.joints) {
                let node = this.modelRoot.getObjectByName(joint.node);
                if (!node) {
                    console.warn(`Joint node not found: ${joint.node}`);
                    continue;
                }
                if (!node.userData.initialWorldQuaternion) {
                    // Store initial world-space transform (never changes)
                    node.userData.initialWorldQuaternion = new THREE.Quaternion();
                    node.getWorldQuaternion(node.userData.initialWorldQuaternion);
                }
                if (!node.userData.initialWorldPosition) {
                    // Store initial world-space position (never changes)
                    node.userData.initialWorldPosition = new THREE.Vector3();
                    node.getWorldPosition(node.userData.initialWorldPosition);
                }
                if (!node.userData.initialLocalQuaternion) {
                    // Preserve original local coordinates (never modified)
                    node.userData.initialLocalQuaternion = node.quaternion.clone();
                }
                if (!node.userData.initialLocalPosition) {
                    // Preserve original local coordinates (never modified)
                    node.userData.initialLocalPosition = node.position.clone();
                }
                
                // Resolve and cache the axis point in the part's own local space (if specified)
                let axisPointPartLocal = null;
                const axisPointRef = joint.axisPoint;
                if (axisPointRef) {
                    if (typeof axisPointRef === 'string') {
                        // Named reference point - get it from part definition
                        const partDef = this.getPartDefinition(joint.node);
                        if (partDef?.referencePoints?.[axisPointRef]) {
                            const refPoint = partDef.referencePoints[axisPointRef];
                            axisPointPartLocal = new THREE.Vector3(
                                refPoint.x || 0,
                                refPoint.y || 0,
                                refPoint.z || 0
                            );
                        }
                    } else if (axisPointRef && typeof axisPointRef === 'object') {
                        // Explicit coordinates in part's local space
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
                    // Transform from part's local space to world space
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

                // Store parent's initial world quaternion for dynamic axis transformation
                let parentBaseWorldQuat = new THREE.Quaternion();
                let parentBaseWorldPos = new THREE.Vector3();
                if (node.parent) {
                    node.parent.getWorldQuaternion(parentBaseWorldQuat);
                    node.parent.getWorldPosition(parentBaseWorldPos);
                }

                // Store joint binding with world-space base transforms
                this.joints.push({
                    descriptor: joint,
                    node: node,
                    baseWorldQuaternion: node.userData.initialWorldQuaternion.clone(),   // Preserve original world rotation
                    baseWorldPosition: node.userData.initialWorldPosition.clone(),       // Preserve original world position
                    parentBaseWorldQuat: parentBaseWorldQuat.clone(),                    // Parent's initial world rotation
                    parentBaseWorldPos: parentBaseWorldPos.clone(),                      // Parent's initial world position
                    axisPointLocal: axisPointPartLocal,                                  // Axis point in part's local coordinates
                    axisPointWorld: axisPointWorld                                       // Axis point in world coordinates
                });
            }
        }

        // Initialize SolidWorks constraints from descriptor
        this.initializeConstraints();
    }

    /**
     * Get a part definition from the descriptor by name.
     * @param {string} partName - Name of the part
     * @returns {Object|null} Part definition or null if not found
     */
    getPartDefinition(partName) {
        return this.partsCache.get(partName) || null;
    }

    /**
     * Resolve a reference point to world coordinates.
     * Reference points are stored in local coordinates (relative to part node).
     * @param {string} partName - Name of the part (GLB node name)
     * @param {string} pointName - Name of the reference point
     * @returns {THREE.Vector3|null} World position of the reference point, or null if not found
     */
    getReferencePointWorldPosition(partName, pointName) {
        // Check cache first
        const cacheKey = `${partName}:${pointName}`;
        if (this.referencePointsCache.has(cacheKey)) {
            return this.referencePointsCache.get(cacheKey).clone();
        }

        // Get part node
        const partNode = this.modelRoot?.getObjectByName(partName);
        if (!partNode) {
            console.warn(`[Kinematics] Part node not found: ${partName}`);
            return null;
        }

        // Get part definition
        const partDef = this.getPartDefinition(partName);
        if (!partDef || !partDef.referencePoints || !partDef.referencePoints[pointName]) {
            console.warn(`[Kinematics] Reference point not found: ${partName}.${pointName}`);
            return null;
        }

        // Get local coordinates
        const localPoint = partDef.referencePoints[pointName];
        const worldPos = new THREE.Vector3(
            (localPoint.x || 0) * this.referencePointScale,
            (localPoint.y || 0) * this.referencePointScale,
            (localPoint.z || 0) * this.referencePointScale
        );

        // Transform to world coordinates
        worldPos.applyMatrix4(partNode.matrixWorld);

        // Cache the result
        this.referencePointsCache.set(cacheKey, worldPos.clone());

        return worldPos;
    }

    /**
     * Resolve a reference plane to world coordinates.
     * @param {string} partName - Name of the part (GLB node name)
     * @param {string} planeName - Name of the reference plane
     * @returns {Object|null} Plane with {normal: Vector3, point: Vector3} in world coords, or null if not found
     */
    getReferencePlaneWorld(partName, planeName) {
        // Get part node
        const partNode = this.modelRoot?.getObjectByName(partName);
        if (!partNode) {
            console.warn(`[Kinematics] Part node not found: ${partName}`);
            return null;
        }

        // Get part definition
        const partDef = this.getPartDefinition(partName);
        if (!partDef || !partDef.referencePlanes || !partDef.referencePlanes[planeName]) {
            console.warn(`[Kinematics] Reference plane not found: ${partName}.${planeName}`);
            return null;
        }

        const planeDef = partDef.referencePlanes[planeName];
        
        // Transform normal (direction, no translation)
        const worldNormal = new THREE.Vector3(
            planeDef.normal[0] || 0,
            planeDef.normal[1] || 0,
            planeDef.normal[2] || 0
        );
        worldNormal.applyMatrix4(partNode.matrixWorld);
        worldNormal.sub(partNode.position); // Remove translation component
        worldNormal.normalize();

        // Transform point (position with translation)
        const worldPoint = new THREE.Vector3(
            planeDef.point[0] || 0,
            planeDef.point[1] || 0,
            planeDef.point[2] || 0
        );
        worldPoint.applyMatrix4(partNode.matrixWorld);

        return { normal: worldNormal, point: worldPoint };
    }

    /**
     * Invalidate the reference points cache for a part.
     * Called when a part moves and reference points need to be recalculated.
     * @param {string} partName - Name of the part, or null to clear entire cache
     */
    invalidateReferencePointCache(partName) {
        if (!partName) {
            this.referencePointsCache.clear();
            return;
        }
        // Remove all cache entries for this part
        const prefix = `${partName}:`;
        for (const key of this.referencePointsCache.keys()) {
            if (key.startsWith(prefix)) {
                this.referencePointsCache.delete(key);
            }
        }
    }

    /**
     * Visualize all reference points in the Three.js scene.
     * Creates small spheres with labels for each reference point defined in the descriptor.
     * This helps debug whether reference points are positioned correctly.
     */
    visualizeReferencePoints() {
        // Remove previous visualization if it exists
        this.hideReferencePoints();

        // Create a container group for all reference point visuals
        this.referencePointVisualization = new THREE.Group();
        this.referencePointVisualization.name = "referencePointVisualization";

        if (!this.kinematicsDescriptor?.parts) {
            return;
        }

        // Create visuals for each reference point
        for (const partDef of this.kinematicsDescriptor.parts) {
            const partNode = this.modelRoot?.getObjectByName(partDef.name);
            if (!partNode) {
                console.warn(`Part not found for visualization: ${partDef.name}`);
                continue;
            }

            if (!partDef.referencePoints) {
                continue;
            }

            // Create a sphere for each reference point
            for (const [pointName, pointCoords] of Object.entries(partDef.referencePoints)) {
                // Get world position of this reference point
                const worldPos = this.getReferencePointWorldPosition(partDef.name, pointName);
                if (!worldPos) {
                    continue;
                }

                // Scale sphere and label size based on reference point scale
                const sphereRadius = 2 * this.referencePointScale;
                const labelWidth = 20 * this.referencePointScale;
                const labelHeight = 6 * this.referencePointScale;
                const labelFontSize = Math.max(16, 40 * this.referencePointScale); // Minimum 16px for readability

                // Create a small sphere as a visual marker
                const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
                const material = new THREE.MeshStandardMaterial({
                    color: 0xFF6B6B,
                    emissive: 0xFF6B6B,
                    metalness: 0.3,
                    roughness: 0.4
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(worldPos);
                sphere.scale.set(1, 1, 1);
                this.referencePointVisualization.add(sphere);

                // Create a label with the reference point name
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FF6B6B';
                ctx.font = `Bold ${labelFontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(`${partDef.name}`, 128, 30);
                ctx.fillText(`${pointName}`, 128, 55);

                const texture = new THREE.CanvasTexture(canvas);
                const labelGeometry = new THREE.PlaneGeometry(labelWidth, labelHeight);
                const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
                const label = new THREE.Mesh(labelGeometry, labelMaterial);
                label.position.copy(worldPos);
                label.position.z += 5 * this.referencePointScale; // Offset slightly in front, scaled
                this.referencePointVisualization.add(label);

                console.log(`[Visualization] Reference point: ${partDef.name}.${pointName} at (${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)})`);
            }
        }

        // Add the visualization to the scene
        this.scene.add(this.referencePointVisualization);
        console.log(`[Visualization] ✓ Visualized ${this.referencePointVisualization.children.length / 2} reference points`);
    }

    /**
     * Hide the reference point visualization by removing it from the scene.
     */
    hideReferencePoints() {
        if (this.referencePointVisualization) {
            this.scene.remove(this.referencePointVisualization);
            this.referencePointVisualization = null;
        }
    }

    /**
     * Initialize and validate SolidWorks constraints from descriptor.
     * Parses solver configuration, validates constraint weights, and detects conflicts.
     * Supported primitive constraints:
     * - PointPointCoincident: Forces two points to coincide (3 translational DOF)
     * - PointPlane: Forces a point to lie on a plane (1 translational DOF)
     * - PlanePlaneParallel: Forces two planes to be parallel (1 rotational DOF)
     * 
    * Supported composite constraints (built from primitives):
     * - Horizontal: Forces edge/plane to be horizontal
     * - Vertical: Forces edge/plane to be vertical
    * - Fixed: Fixes a part in place (position + orientation)
    * - FixedJoint: Fixes a pivot point, optional rotation plane
    * - Joint: Joint with plane + coincident/offset along plane normal
     */
    initializeConstraints() {
        this.constraints = [];
        this.constraintConflicts = [];
        
        // Parse solver configuration
        if (this.kinematicsDescriptor?.constraintSolver) {
            const config = this.kinematicsDescriptor.constraintSolver;
            this.instantMotion = config.instantMotion ?? true;
            this.maxConstraintIterations = config.maxIterations ?? (this.instantMotion ? 50 : 10);
            this.convergenceThreshold = config.convergenceThreshold ?? 0.001;
            this.enableConflictDetection = config.enableConflictDetection ?? true;
            this.constraintGainScale = config.gainScale ?? (this.instantMotion ? 2.0 : 1.0);
            this.translationWeight = config.translationWeight ?? 1.0;
            this.rotationWeight = config.rotationWeight ?? 1.0;
            this.maxLinearStep = config.maxLinearStep ?? 0.0;
            this.maxAngularStep = config.maxAngularStep ?? 0.0;
            this.referencePointScale = config.referencePointScale ?? 1.0;
            
            // Apply reference point visualization setting
            const shouldShowRefPoints = config.showReferencePoints ?? false;
            if (shouldShowRefPoints && !this.showReferencePoints) {
                this.showReferencePoints = true;
                this.visualizeReferencePoints();
            } else if (!shouldShowRefPoints && this.showReferencePoints) {
                this.showReferencePoints = false;
                this.hideReferencePoints();
            }
        }
        
        if (!this.kinematicsDescriptor?.constraints) {
            return;
        }

        for (let constraintDef of this.kinematicsDescriptor.constraints) {
            // Validate constraint has required fields
            if (!constraintDef.type || !constraintDef.entities) {
                console.warn(`[Gripper Constraints] Invalid constraint definition:`, constraintDef);
                continue;
            }

            // Normalize entities: allow array of names or objects with referencePoint/referencePlane
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
                        console.warn(`[Gripper Constraints] Entity object missing name:`, entry);
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
                    console.warn(`[Gripper Constraints] Invalid entity entry:`, entry);
                }
            }

            // Resolve entity references to Three.js nodes
            let resolvedEntities = [];
            for (let entityDef of normalizedEntities) {
                let entity = this.modelRoot.getObjectByName(entityDef.name);
                if (!entity) {
                    console.warn(`[Gripper Constraints] Constraint entity not found: ${entityDef.name}`);
                    continue;
                }
                resolvedEntities.push({ name: entityDef.name, node: entity });
            }

            if (resolvedEntities.length < normalizedEntities.length) {
                console.warn(`[Gripper Constraints] Some entities not found for constraint:`, constraintDef);
                continue;
            }

            // Resolve optional reference points (per-part reference geometry)
            const resolvedReferencePoints = normalizedEntities.map(entityDef => {
                if (!entityDef.referencePoint) return null;
                return { name: entityDef.referencePoint, entityName: entityDef.name };
            });
            const hasReferencePoints = resolvedReferencePoints.some(Boolean);

            // Resolve optional reference planes (per-part reference geometry for plane constraints)
            const resolvedReferencePlanes = normalizedEntities.map(entityDef =>
                entityDef.referencePlane ? entityDef.referencePlane : null
            );
            const hasReferencePlanes = resolvedReferencePlanes.some(Boolean);

            // Resolve optional datum references (legacy Hybrid Measure & Move approach - kept for compatibility)
            let resolvedDatums = null;
            const datumNames = normalizedEntities.map(entityDef => entityDef.datum ?? null);
            if (datumNames.some(Boolean)) {
                resolvedDatums = [];
                for (let datumName of datumNames) {
                    if (!datumName) {
                        resolvedDatums.push(null);
                        continue;
                    }
                    let datumNode = this.modelRoot.getObjectByName(datumName);
                    if (!datumNode) {
                        console.warn(`[Gripper Constraints] Datum not found: ${datumName}`);
                        resolvedDatums = null;
                        break;
                    }
                    resolvedDatums.push({ name: datumName, node: datumNode });
                }
            }

            // Parse and validate weight (default to 1.0 for hard constraints)
            let weight = constraintDef.weight ?? 1.0;
            if (typeof weight !== 'number' || weight < 0 || weight > 1) {
                console.warn(`[Gripper Constraints] Invalid weight ${weight} for constraint '${constraintDef.id}', using 1.0`);
                weight = 1.0;
            }

            // Extract and normalize per-entity weights
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
                entityWeights: normalizedEntityWeights,  // Per-entity weights normalized to sum=1.0
                referencePoints: hasReferencePoints ? resolvedReferencePoints : null,  // New: per-part reference geometry (points)
                referencePlanes: hasReferencePlanes ? resolvedReferencePlanes : null,  // New: per-part reference geometry (planes)
                datums: resolvedDatums,                     // Legacy: datum nodes from scene graph
                weight: weight,
                value: constraintDef.value,
                definition: constraintDef,
                fixedTargets: null
            });

            // Precompute fixed target transforms (world-space) if constraint is Fixed
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

            // Precompute fixed joint targets (pivot point + optional plane) if constraint is FixedJoint
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
                        pivotWorld = this.getReferencePointWorldPosition(entity.name, refPointDef.name);
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

        console.log(`[Gripper Constraints] Initialized ${this.constraints.length} constraints with iterative solver (max ${this.maxConstraintIterations} iterations)`);
        
        // Detect conflicts if enabled
        if (this.enableConflictDetection && this.constraints.length > 1) {
            this.detectConstraintConflicts();
            if (this.constraintConflicts.length > 0) {
                console.warn(`[Gripper Constraints] Detected ${this.constraintConflicts.length} potential conflicts:`);
                this.constraintConflicts.forEach(conflict => console.warn(`  - ${conflict}`));
            }
        }
    }

    /**
     * Detect potential conflicts between constraints.
     * Warns about contradictory or over-constrained configurations.
     */
    detectConstraintConflicts() {
        this.constraintConflicts = [];

        // Check for contradictory orientation constraints on same entities
        for (let i = 0; i < this.constraints.length; i++) {
            for (let j = i + 1; j < this.constraints.length; j++) {
                const c1 = this.constraints[i];
                const c2 = this.constraints[j];

                // Check if constraints share entities
                const sharedEntities = c1.entities.filter(e1 => 
                    c2.entities.some(e2 => e2.name === e1.name)
                );

                if (sharedEntities.length === 0) continue;

                // Detect specific conflicts
                const conflict = this.checkConstraintPairConflict(c1, c2, sharedEntities);
                if (conflict) {
                    this.constraintConflicts.push(
                        `Constraints '${c1.id}' (${c1.type}) and '${c2.id}' (${c2.type}) conflict on entities: ${sharedEntities.map(e => e.name).join(', ')} - ${conflict}`
                    );
                }
            }
        }

        // Check for over-constrained entities (too many constraints on single entity)
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
     * Check if two constraints are contradictory.
     * @returns {string|null} Conflict description or null if no conflict
     */
    checkConstraintPairConflict(c1, c2, sharedEntities) {
        // Horizontal + Vertical conflict
        if ((c1.type === 'Horizontal' && c2.type === 'Vertical') ||
            (c1.type === 'Vertical' && c2.type === 'Horizontal')) {
            return 'Cannot be both horizontal and vertical';
        }

        return null;
    }

    /**
     * Apply SolidWorks constraints using iterative solver.
     * Iteratively applies constraints until convergence or max iterations reached.
     * This is called after servo state is applied to enforce mechanical relationships.
     */
    applyConstraints() {
        if (this.constraints.length === 0) {
            return;
        }

        // Sort constraints by weight (highest priority first)
        const sortedConstraints = [...this.constraints].sort((a, b) => b.weight - a.weight);

        // Store initial state for convergence checking
        const initialState = this.captureEntityState();
        let previousState = initialState;

        // Iterative constraint solver
        for (let iteration = 0; iteration < this.maxConstraintIterations; iteration++) {
            // Clear reference point cache at start of each iteration
            // This ensures we read fresh positions after parts have moved
            this.invalidateReferencePointCache(null);

            // Apply all constraints in priority order
            for (let constraint of sortedConstraints) {
                this.applyConstraintWithWeight(constraint);
            }

            // Check for convergence
            const currentState = this.captureEntityState();
            const maxDelta = this.computeMaxStateDelta(previousState, currentState);
            const maxError = this.computeMaxConstraintError(sortedConstraints);

            if (maxDelta < this.convergenceThreshold && maxError < this.convergenceThreshold) {
                // Converged!
                if (iteration > 0) {
                    console.log(`[Gripper Constraints] Converged in ${iteration + 1} iterations (delta: ${maxDelta.toFixed(6)}, error: ${maxError.toFixed(6)})`);
                }
                return;
            }

            previousState = currentState;
        }

        // Did not converge - log warning
        console.warn(`[Gripper Constraints] Did not converge after ${this.maxConstraintIterations} iterations (may have conflicting constraints)`);
    }

    /**
     * Capture current state of all constrained entities for convergence checking.
     * @returns {Map} Map of entity name to {position, quaternion}
     */
    captureEntityState() {
        const state = new Map();
        const processedEntities = new Set();

        this.constraints.forEach(constraint => {
            constraint.entities.forEach(entity => {
                if (!processedEntities.has(entity.name)) {
                    processedEntities.add(entity.name);
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
     * Compute maximum state change between two entity states.
     * @returns {number} Maximum delta in radians/units
     */
    computeMaxStateDelta(prevState, currentState) {
        let maxDelta = 0;

        currentState.forEach((current, entityName) => {
            const prev = prevState.get(entityName);
            if (!prev) return;

            // Position delta
            const posDelta = current.position.distanceTo(prev.position);
            maxDelta = Math.max(maxDelta, posDelta);

            // Rotation delta (angle between quaternions)
            const rotDelta = current.quaternion.angleTo(prev.quaternion);
            maxDelta = Math.max(maxDelta, rotDelta);
        });

        return maxDelta;
    }

    /**
     * Compute maximum constraint error across all constraints.
     * Uses geometric error (distance/angle) instead of per-iteration motion.
     * @param {Array} constraints
     * @returns {number} Maximum error magnitude in world units or radians
     */
    computeMaxConstraintError(constraints) {
        let maxError = 0;

        const getPointWorld = (constraint, index) => {
            const ref = constraint.referencePoints?.[index];
            if (ref) {
                const refName = typeof ref === 'string' ? ref : ref.name;
                const refEntityName = typeof ref === 'string'
                    ? constraint.entities[index].name
                    : (ref.entityName ?? constraint.entities[index].name);
                const point = this.getReferencePointWorldPosition(refEntityName, refName);
                if (point) return point;
            }
            return constraint.entities[index].node.getWorldPosition(new THREE.Vector3());
        };

        const getPlaneWorld = (constraint, index) => {
            const ref = constraint.referencePlanes?.[index];
            if (ref) {
                const refName = typeof ref === 'string' ? ref : ref.name;
                const plane = this.getReferencePlaneWorld(constraint.entities[index].name, refName);
                if (plane) return plane;
            }

            const node = constraint.entities[index].node;
            const q = node.getWorldQuaternion(new THREE.Quaternion());
            return {
                normal: new THREE.Vector3(0, 0, 1).applyQuaternion(q).normalize(),
                point: node.getWorldPosition(new THREE.Vector3())
            };
        };

        for (const constraint of constraints) {
            const type = constraint.type?.toUpperCase();
            if (!type) continue;

            switch (type) {
                case 'POINTPOINTCOINCIDENT': {
                    if (constraint.entities.length < 2) break;
                    const p0 = getPointWorld(constraint, 0);
                    for (let i = 1; i < constraint.entities.length; i++) {
                        const pi = getPointWorld(constraint, i);
                        maxError = Math.max(maxError, p0.distanceTo(pi));
                    }
                    break;
                }
                case 'POINTPLANE': {
                    if (constraint.entities.length < 2) break;
                    const p = getPointWorld(constraint, 0);
                    const plane = getPlaneWorld(constraint, 1);
                    const distance = Math.abs(plane.normal.dot(p.clone().sub(plane.point)));
                    maxError = Math.max(maxError, distance);
                    break;
                }
                case 'PLANEPARALLEL': {
                    if (constraint.entities.length < 2) break;
                    const plane1 = getPlaneWorld(constraint, 0);
                    const n1 = plane1.normal;
                    for (let i = 1; i < constraint.entities.length; i++) {
                        const plane2 = getPlaneWorld(constraint, i);
                        const n2 = plane2.normal;
                        const angle = n1.angleTo(n2);
                        maxError = Math.max(maxError, angle);

                        if (constraint.value?.coincident) {
                            const distance = Math.abs(n1.dot(plane2.point.clone().sub(plane1.point)));
                            maxError = Math.max(maxError, distance);
                        }
                    }
                    break;
                }
                case 'HORIZONTAL': {
                    if (constraint.entities.length < 1) break;
                    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
                    const measureQuat = new THREE.Quaternion();
                    measureNode.getWorldQuaternion(measureQuat);
                    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat);
                    const horizontalNormal = new THREE.Vector3(worldNormal.x, 0, worldNormal.z);
                    if (horizontalNormal.lengthSq() < 1e-8) break;
                    horizontalNormal.normalize();
                    const angle = worldNormal.angleTo(horizontalNormal);
                    maxError = Math.max(maxError, angle);
                    break;
                }
                case 'VERTICAL': {
                    if (constraint.entities.length < 1) break;
                    const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
                    const measureQuat = new THREE.Quaternion();
                    measureNode.getWorldQuaternion(measureQuat);
                    const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat).normalize();
                    const verticalNormal = new THREE.Vector3(0, Math.sign(worldNormal.y) || 1, 0);
                    const angle = worldNormal.angleTo(verticalNormal);
                    maxError = Math.max(maxError, angle);
                    break;
                }
                case 'FIXED': {
                    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) break;
                    for (let i = 0; i < constraint.entities.length; i++) {
                        const node = constraint.entities[i].node;
                        const target = constraint.fixedTargets[i];
                        const pos = node.getWorldPosition(new THREE.Vector3());
                        const quat = node.getWorldQuaternion(new THREE.Quaternion());
                        maxError = Math.max(maxError, pos.distanceTo(target.position));
                        maxError = Math.max(maxError, quat.angleTo(target.quaternion));
                    }
                    break;
                }
                case 'FIXEDJOINT': {
                    if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) break;
                    for (let i = 0; i < constraint.entities.length; i++) {
                        const target = constraint.fixedTargets[i];
                        const point = getPointWorld(constraint, i);
                        maxError = Math.max(maxError, point.distanceTo(target.position));

                        if (target.planeNormal && target.referencePlane) {
                            const plane = getPlaneWorld(constraint, i);
                            const targetNormal = target.planeNormal.clone().normalize();
                            const angle = plane.normal.angleTo(targetNormal);
                            maxError = Math.max(maxError, angle);
                        }
                    }
                    break;
                }
                case 'JOINT': {
                    if (constraint.entities.length < 2) break;
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
                                const plane = getPlaneWorld(constraint, i);
                                const angle = plane.normal.angleTo(planeNormal);
                                maxError = Math.max(maxError, angle);
                            }
                        }
                    }

                    const refPointA = constraint.referencePoints?.[0] || null;
                    const refPointB = constraint.referencePoints?.[1] || null;
                    const pA = refPointA ? getPointWorld(constraint, 0) : constraint.entities[0].node.getWorldPosition(new THREE.Vector3());
                    const pB = refPointB ? getPointWorld(constraint, 1) : constraint.entities[1].node.getWorldPosition(new THREE.Vector3());

                    const coincident = constraint.value?.coincident ?? false;
                    const offset = coincident ? 0.0 : (constraint.value?.offset ?? constraint.value?.distance ?? 0.0);
                    if (planeNormal) {
                        const distance = Math.abs(planeNormal.dot(pB.clone().sub(pA)) - offset);
                        maxError = Math.max(maxError, distance);
                    }
                    break;
                }
                default:
                    break;
            }
        }

        return maxError;
    }

    /**
     * Apply a single constraint with weight factor.
     * Weight allows for soft constraints (partial enforcement).
     */
    applyConstraintWithWeight(constraint) {
        switch (constraint.type.toUpperCase()) {
            // Primitive constraints (basis for all others)
            case "POINTPOINTCOINCIDENT":
                this.applyPointPointCoincidentConstraint(constraint);
                break;
            case "POINTPLANE":
                this.applyPointPlaneConstraint(constraint);
                break;
            case "PLANEPARALLEL":
                this.applyPlanePlaneParallelConstraint(constraint);
                break;
            // Composite constraints
            case "HORIZONTAL":
                this.applyHorizontalConstraint(constraint);
                break;
            case "VERTICAL":
                this.applyVerticalConstraint(constraint);
                break;
            case "FIXED":
                this.applyFixedConstraint(constraint);
                break;
            case "FIXEDJOINT":
                this.applyFixedJointConstraint(constraint);
                break;
            case "JOINT":
                this.applyJointConstraint(constraint);
                break;
            default:
                console.warn(`[Gripper Constraints] Unknown constraint type: ${constraint.type}`);
        }
    }

    /**
     * Apply a world-space transform to a node, converting to local space if needed.
     * @param {THREE.Object3D} node
     * @param {THREE.Vector3} targetWorldPos
     * @param {THREE.Quaternion} targetWorldQuat
     */
    applyWorldTransform(node, targetWorldPos, targetWorldQuat) {
        if (!node) return;
        if (!node.parent) {
            node.position.copy(targetWorldPos);
            node.quaternion.copy(targetWorldQuat);
            return;
        }

        const parentQuat = new THREE.Quaternion();
        node.parent.getWorldQuaternion(parentQuat);
        const invParentQuat = parentQuat.clone().invert();

        const localPos = targetWorldPos.clone();
        node.parent.worldToLocal(localPos);
        const localQuat = invParentQuat.multiply(targetWorldQuat.clone());

        node.position.copy(localPos);
        node.quaternion.copy(localQuat);
    }

    clampStep(vec, maxLength) {
        if (!maxLength || maxLength <= 0) return vec;
        const len = vec.length();
        if (len > maxLength) {
            vec.multiplyScalar(maxLength / len);
        }
        return vec;
    }

    /**
     * Create a virtual reference entity with a given world-space plane normal and point.
     * Used to build composite constraints from primitives.
     * @param {THREE.Vector3} normal - Desired plane normal in world space (uses local +Z).
     * @param {THREE.Vector3} point - Desired plane point in world space.
     * @param {string} name - Optional name for the virtual entity.
     * @returns {{name: string, node: THREE.Object3D}}
     */
    createVirtualPlaneEntity(normal, point, name = '__virtual_plane__') {
        const node = new THREE.Object3D();
        const targetNormal = normal ? normal.clone().normalize() : new THREE.Vector3(0, 0, 1);
        const rotation = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            targetNormal
        );
        node.quaternion.copy(rotation);
        node.position.copy(point ?? new THREE.Vector3());
        return { name, node };
    }

    /**
     * PRIMITIVE CONSTRAINT: Point-Point Coincidence (Twist-based)
     *
     * Enforces coincidence of two world-space points by applying
     * a small rigid-body motion (twist = translation + rotation).
     *
     * IMPORTANT:
     * - We do NOT rotate around a chosen pivot
     * - We compute a twist (Δv, Δω)
     * - The instantaneous pivot emerges implicitly
     *
     * This composes correctly with other constraints.
     */
    applyPointPointCoincidentConstraint(constraint) {
        if (constraint.entities.length < 2) return;

        const weight = constraint.weight ?? 1.0;
        const stiffness = Math.max(0.0, Math.min(1.0, weight));
        const entityWeights = constraint.entityWeights ?? constraint.entities.map(() => 1.0 / constraint.entities.length);

        // ---------------------------------------------------------
        // 1. Determine target world-space point (reference)
        // ---------------------------------------------------------
        let targetPoint = null;

        if (constraint.referencePoints?.[0]) {
            const { entityName, name } = constraint.referencePoints[0];
            targetPoint = this.getReferencePointWorldPosition(entityName, name);
        }

        if (!targetPoint) {
            targetPoint = constraint.entities[0].node.getWorldPosition(new THREE.Vector3());
        }

        // ---------------------------------------------------------
        // 2. Apply constraint to all other entities
        // ---------------------------------------------------------
        for (let i = 1; i < constraint.entities.length; i++) {
            const entity = constraint.entities[i];
            const node = entity.node;

            // Get per-entity weights (normalized)
            const weight0 = entityWeights[0] ?? 1.0;
            const weightI = entityWeights[i] ?? 1.0;

            // ---------------------------------------------
            // 2.1 Get constrained point on this body
            // ---------------------------------------------
            let currentPointWorld = null;

            if (constraint.referencePoints?.[i]) {
                const { entityName, name } = constraint.referencePoints[i];
                currentPointWorld = this.getReferencePointWorldPosition(entityName, name);
            }

            if (!currentPointWorld) {
                currentPointWorld = node.getWorldPosition(new THREE.Vector3());
            }

            // ---------------------------------------------
            // 2.2 Compute positional error
            // ---------------------------------------------
            const error = targetPoint.clone().sub(currentPointWorld);

            if (error.lengthSq() < 1e-8) continue;

            // Apply weight distribution: entity i moves by weightI fraction of error
            const errorI = error.clone().multiplyScalar(weightI);

            // Apply opposite correction to reference entity (entity 0)
            const errorRef = error.clone().multiplyScalar(-weight0);

            // Also move reference entity to account for asymmetric weights
            const refEntity = constraint.entities[0];
            const refNode = refEntity.node;
            const refBodyOrigin = refNode.getWorldPosition(new THREE.Vector3());
            let refCurrentPoint = targetPoint.clone();

            if (constraint.referencePoints?.[0]) {
                const { entityName, name } = constraint.referencePoints[0];
                refCurrentPoint = this.getReferencePointWorldPosition(entityName, name);
            }

            // Vector from ref body origin to its constrained point
            const rRef = refCurrentPoint.clone().sub(refBodyOrigin);

            // ---------------------------------------------------------
            // 2.3 Rigid body state for current entity
            // ---------------------------------------------------------
            const bodyOrigin = node.getWorldPosition(new THREE.Vector3());
            const bodyQuat = node.getWorldQuaternion(new THREE.Quaternion());

            // Vector from body origin to constrained point
            const r = currentPointWorld.clone().sub(bodyOrigin);

            // ---------------------------------------------------------
            // 3. Compute TWIST for the moving entity (entity i)
            // ---------------------------------------------------------
            // Note: rotationGain is higher than translationGain to balance scale mismatch
            // between linear motion (world units) and angular motion (radians).
            // Without this scaling, the solver prefers translations over necessary rotations.
            const translationGain = 0.5 * stiffness * this.constraintGainScale * this.translationWeight;
            const rotationGain = 1.5 * stiffness * this.constraintGainScale * this.rotationWeight;  // weighted rotation gain

            // Linear part of the twist
            const deltaV = this.clampStep(
                errorI.clone().multiplyScalar(translationGain),
                this.maxLinearStep
            );

            // Angular part of the twist
            const deltaOmega = this.clampStep(
                r.clone().cross(errorI).multiplyScalar(rotationGain),
                this.maxAngularStep
            );

            // ---------------------------------------------------------
            // 4. Apply TWIST to the moving entity
            // ---------------------------------------------------------

            // 4.1 Apply rotation: exp(δω^) · R
            const angle = deltaOmega.length();
            if (angle > 1e-8) {
                const axis = deltaOmega.clone().normalize();
                const dq = new THREE.Quaternion().setFromAxisAngle(axis, angle);

                // premultiply = world-space rotation
                node.quaternion.premultiply(dq);
            }

            // 4.2 Apply translation: x ← x + δv
            node.position.add(deltaV);

            // ---------------------------------------------------------
            // 5. Apply opposite correction to reference entity (if weight0 > 0)
            // ---------------------------------------------------------
            if (weight0 > 0.0) {
                const deltaVRef = this.clampStep(
                    errorRef.clone().multiplyScalar(translationGain),
                    this.maxLinearStep
                );
                const deltaOmegaRef = this.clampStep(
                    rRef.clone().cross(errorRef).multiplyScalar(rotationGain),
                    this.maxAngularStep
                );

                // Apply rotation to reference entity
                const angleRef = deltaOmegaRef.length();
                if (angleRef > 1e-8) {
                    const axisRef = deltaOmegaRef.clone().normalize();
                    const dqRef = new THREE.Quaternion().setFromAxisAngle(axisRef, angleRef);
                    refNode.quaternion.premultiply(dqRef);
                }

                // Apply translation to reference entity
                refNode.position.add(deltaVRef);
            }

            // ---------------------------------------------------------
            // 5. Invalidate reference cache (geometry moved)
            // ---------------------------------------------------------
            this.invalidateReferencePointCache(entity.name);
        }
    }

    /**
     * PRIMITIVE CONSTRAINT: Point-Plane (Twist-based)
     *
     * Forces a point on one body to lie on a plane defined by another body.
     * Constrains 1 translational DOF (along plane normal).
     *
     * Implemented as a small rigid-body twist (Δv, Δω).
     * No pivot is chosen explicitly — the instantaneous pivot emerges naturally.
     */
    applyPointPlaneConstraint(constraint) {
        if (constraint.entities.length < 2) return;

        const stiffness = Math.max(0.0, Math.min(1.0, constraint.weight ?? 1.0));
        const entityWeights = constraint.entityWeights ?? [0.5, 0.5];

        // Get per-entity weights
        const weight0 = entityWeights[0] ?? 0.5;
        const weight1 = entityWeights[1] ?? 0.5;

        // ---------------------------------------------------------
        // 1. Get plane definition (world space)
        // ---------------------------------------------------------
        let plane = null;
        const planeEntity = constraint.entities[1];

        if (constraint.referencePlanes?.[1]) {
            const planeRef = constraint.referencePlanes[1];
            const planeName = typeof planeRef === 'string' ? planeRef : planeRef.name;
            plane = this.getReferencePlaneWorld(planeEntity.name, planeName);
        }

        if (!plane) {
            // Fallback: entity origin + its local +Z as plane
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

        // ---------------------------------------------------------
        // 2. Get constrained point (world space)
        // ---------------------------------------------------------
        const pointEntity = constraint.entities[0];
        let p = null;

        if (constraint.referencePoints?.[0]) {
            const pointName = constraint.referencePoints[0].name;
            p = this.getReferencePointWorldPosition(pointEntity.name, pointName);
        }

        if (!p) {
            p = pointEntity.node.getWorldPosition(new THREE.Vector3());
        }

        // ---------------------------------------------------------
        // 3. Compute constraint error
        // ---------------------------------------------------------
        // Signed distance from point to plane
        const signedDistance = n.dot(p.clone().sub(plane.point));

        if (Math.abs(signedDistance) < 1e-6) return;

        // ---------------------------------------------------------
        // 4. Apply correction to point entity (entity 0)
        // ---------------------------------------------------------
        const pointNode = pointEntity.node;
        const bodyOrigin = pointNode.getWorldPosition(new THREE.Vector3());

        // Vector from body origin to constrained point
        const r = p.clone().sub(bodyOrigin);

        // Compute corrective TWIST for point entity using its weight
        // Note: rotationGain is higher than translationGain to balance scale mismatch
        const translationGain = 0.6 * stiffness * this.constraintGainScale * this.translationWeight;
        const rotationGain = 1.8 * stiffness * this.constraintGainScale * this.rotationWeight;  // weighted rotation gain

        // Point moves by its weight fraction
        const deltaV0 = this.clampStep(
            n.clone().multiplyScalar(-signedDistance * weight0 * translationGain),
            this.maxLinearStep
        );
        const deltaOmega0 = this.clampStep(
            r.clone().cross(n).multiplyScalar(-signedDistance * weight0 * rotationGain),
            this.maxAngularStep
        );

        // Apply twist to point entity
        const angle0 = deltaOmega0.length();
        if (angle0 > 1e-8) {
            const axis0 = deltaOmega0.clone().normalize();
            const dq0 = new THREE.Quaternion().setFromAxisAngle(axis0, angle0);
            pointNode.quaternion.premultiply(dq0);
        }
        pointNode.position.add(deltaV0);

        // ---------------------------------------------------------
        // 5. Apply opposite correction to plane entity (entity 1)
        // ---------------------------------------------------------
        if (weight1 > 0.0) {
            const planeNode = planeEntity.node;
            const planeOrigin = planeNode.getWorldPosition(new THREE.Vector3());

            // Vector from plane body origin to plane point
            const rPlane = plane.point.clone().sub(planeOrigin);

            // Plane moves opposite by its weight fraction
            const deltaV1 = this.clampStep(
                n.clone().multiplyScalar(signedDistance * weight1 * translationGain),
                this.maxLinearStep
            );
            const deltaOmega1 = this.clampStep(
                rPlane.clone().cross(n).multiplyScalar(signedDistance * weight1 * rotationGain),
                this.maxAngularStep
            );

            // Apply twist to plane entity
            const angle1 = deltaOmega1.length();
            if (angle1 > 1e-8) {
                const axis1 = deltaOmega1.clone().normalize();
                const dq1 = new THREE.Quaternion().setFromAxisAngle(axis1, angle1);
                planeNode.quaternion.premultiply(dq1);
            }
            planeNode.position.add(deltaV1);

            // Invalidate plane reference cache
            this.invalidateReferencePointCache(planeEntity.name);
        }

        // ---------------------------------------------------------
        // 6. Invalidate reference cache
        // ---------------------------------------------------------
        this.invalidateReferencePointCache(pointEntity.name);
    }

    /**
     * PRIMITIVE CONSTRAINT: Plane-Plane Parallel (Twist-based)
     *
     * Forces plane2 to be parallel to plane1 by aligning normals.
     * Optionally makes planes coincident.
     *
     * Implemented using incremental rigid-body twists (Δv, Δω).
     */
    applyPlanePlaneParallelConstraint(constraint) {
        if (constraint.entities.length < 2) return;

        const stiffness = Math.max(0.0, Math.min(1.0, constraint.weight ?? 1.0));
        const entityWeights = constraint.entityWeights ?? constraint.entities.map(() => 1.0 / constraint.entities.length);
        const makeCoincident = constraint.value?.coincident ?? false;

        // ---------------------------------------------------------
        // 1. Get reference plane (plane1)
        // ---------------------------------------------------------
        let plane1 = null;
        const entity1 = constraint.entities[0];

        if (constraint.referencePlanes?.[0]) {
            plane1 = this.getReferencePlaneWorld(entity1.name, constraint.referencePlanes[0]);
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

        // ---------------------------------------------------------
        // 2. Process all other planes
        // ---------------------------------------------------------
        for (let i = 1; i < constraint.entities.length; i++) {
            const entity2 = constraint.entities[i];
            const node2 = entity2.node;
            const weight2 = entityWeights[i] ?? 1.0;

            let plane2 = null;

            if (constraint.referencePlanes?.[i]) {
                plane2 = this.getReferencePlaneWorld(entity2.name, constraint.referencePlanes[i]);
            }

            if (!plane2) {
                const q2 = node2.getWorldQuaternion(new THREE.Quaternion());
                plane2 = {
                    normal: new THREE.Vector3(0, 0, 1).applyQuaternion(q2).normalize(),
                    point: node2.getWorldPosition(new THREE.Vector3())
                };
            }

            const n2 = plane2.normal;

            // ---------------------------------------------------------
            // 3. ROTATIONAL constraint: align normals
            // ---------------------------------------------------------
            //
            // Error direction: n2 × n1
            // This angular velocity rotates n2 toward n1
            //
            const normalError = n2.clone().cross(n1);
            const normalErrorMag = normalError.length();

            let deltaOmega2 = new THREE.Vector3();
            let deltaOmega1 = new THREE.Vector3();

            // Apply higher gain to rotations to balance scale with translations
            const rotationMultiplier = 1.5 * this.constraintGainScale * this.rotationWeight;  // scaled gain for rotations

            if (normalErrorMag > 1e-6) {
                // Entity 2 rotates toward entity 1 by its weight fraction
                deltaOmega2.copy(normalError)
                    .multiplyScalar(weight2 * stiffness * rotationMultiplier);

                // Entity 1 rotates opposite by its weight fraction (if weight > 0)
                if (weight1 > 0.0) {
                    deltaOmega1.copy(normalError)
                        .multiplyScalar(-weight1 * stiffness * rotationMultiplier);
                }
            }

            // ---------------------------------------------------------
            // 4. TRANSLATIONAL constraint (optional coincidence)
            // ---------------------------------------------------------
            let deltaV2 = new THREE.Vector3();
            let deltaV1 = new THREE.Vector3();

            if (makeCoincident) {
                // Signed distance between planes
                const distance = n1.dot(plane2.point.clone().sub(plane1.point));

                if (Math.abs(distance) > 1e-6) {
                    // Entity 2 translation along plane normal by its weight
                    deltaV2.add(
                        n1.clone().multiplyScalar(
                            -distance * weight2 * stiffness * this.constraintGainScale * this.translationWeight
                        )
                    );

                    // Entity 1 translation opposite by its weight (if weight > 0)
                    if (weight1 > 0.0) {
                        deltaV1.add(
                            n1.clone().multiplyScalar(
                                distance * weight1 * stiffness * this.constraintGainScale * this.translationWeight
                            )
                        );
                    }

                    // Rotational coupling for entity 2
                    const bodyOrigin2 = node2.getWorldPosition(new THREE.Vector3());
                    const r2 = plane2.point.clone().sub(bodyOrigin2);

                    deltaOmega2.add(
                        r2.clone().cross(n1).multiplyScalar(-distance * weight2 * stiffness)
                    );

                    // Rotational coupling for entity 1 (if weight > 0)
                    if (weight1 > 0.0) {
                        const bodyOrigin1 = node1.getWorldPosition(new THREE.Vector3());
                        const r1 = plane1.point.clone().sub(bodyOrigin1);

                        deltaOmega1.add(
                            r1.clone().cross(n1).multiplyScalar(distance * weight1 * stiffness)
                        );
                    }
                }
            }

            // ---------------------------------------------------------
            // 5. Apply TWIST to plane2 body
            // ---------------------------------------------------------

            deltaOmega2 = this.clampStep(deltaOmega2, this.maxAngularStep);
            deltaV2 = this.clampStep(deltaV2, this.maxLinearStep);

            // 5.1 Apply rotation
            const angle2 = deltaOmega2.length();
            if (angle2 > 1e-8) {
                const axis2 = deltaOmega2.clone().normalize();
                const dq2 = new THREE.Quaternion().setFromAxisAngle(axis2, angle2);
                node2.quaternion.premultiply(dq2); // world-space rotation
            }

            // 5.2 Apply translation
            node2.position.add(deltaV2);

            // ---------------------------------------------------------
            // 6. Apply TWIST to plane1 body (if weight1 > 0)
            // ---------------------------------------------------------
            if (weight1 > 0.0) {
                const node1 = entity1.node;

                deltaOmega1 = this.clampStep(deltaOmega1, this.maxAngularStep);
                deltaV1 = this.clampStep(deltaV1, this.maxLinearStep);

                // 6.1 Apply rotation
                const angle1 = deltaOmega1.length();
                if (angle1 > 1e-8) {
                    const axis1 = deltaOmega1.clone().normalize();
                    const dq1 = new THREE.Quaternion().setFromAxisAngle(axis1, angle1);
                    node1.quaternion.premultiply(dq1);
                }

                // 6.2 Apply translation
                node1.position.add(deltaV1);

                // Invalidate reference cache
                this.invalidateReferencePointCache(entity1.name);
            }

            // ---------------------------------------------------------
            // 7. Invalidate reference cache
            // ---------------------------------------------------------
            this.invalidateReferencePointCache(entity2.name);
        }
    }
 

    /**
     * Horizontal Constraint: Forces an edge or plane normal to be horizontal (parallel to XZ plane).
     * Applied to single entity's normal vector.
     * If datums specified, measures orientation at datum but applies rotation to part.
     */
    applyHorizontalConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        const weight = constraint.weight ?? 1.0;

        // Compute the closest horizontal normal (projection onto XZ plane)
        const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
        const measureQuat = new THREE.Quaternion();
        measureNode.getWorldQuaternion(measureQuat);
        const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat);
        const horizontalNormal = new THREE.Vector3(worldNormal.x, 0, worldNormal.z);

        if (horizontalNormal.lengthSq() < 1e-8) return;
        horizontalNormal.normalize();

        const virtualPlane = this.createVirtualPlaneEntity(horizontalNormal, new THREE.Vector3());
        const parallelConstraint = {
            type: 'PlanePlaneParallel',
            entities: [virtualPlane, constraint.entities[0]],
            weight: weight
        };

        this.applyPlanePlaneParallelConstraint(parallelConstraint);
    }

    /**
     * Vertical Constraint: Forces an edge or plane normal to be vertical (parallel to Y-axis).
     * If datums specified, measures orientation at datum but applies rotation to part.
     */
    applyVerticalConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        const weight = constraint.weight ?? 1.0;

        const measureNode = constraint.datums ? constraint.datums[0].node : constraint.entities[0].node;
        const measureQuat = new THREE.Quaternion();
        measureNode.getWorldQuaternion(measureQuat);
        const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(measureQuat).normalize();
        const verticalNormal = new THREE.Vector3(0, Math.sign(worldNormal.y) || 1, 0);

        const virtualPlane = this.createVirtualPlaneEntity(verticalNormal, new THREE.Vector3());
        const parallelConstraint = {
            type: 'PlanePlaneParallel',
            entities: [virtualPlane, constraint.entities[0]],
            weight: weight
        };

        this.applyPlanePlaneParallelConstraint(parallelConstraint);
    }

    /**
     * Fixed Constraint: Fixes one or more entities in place (position + orientation).
     * If datums specified, fixes the datum transform but moves the parent part.
     */
    applyFixedConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        const weight = constraint.weight ?? 1.0;

        if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) {
            console.warn(`[Gripper Constraints] Fixed constraint is missing target transforms: ${constraint.id}`);
            return;
        }

        for (let i = 0; i < constraint.entities.length; i++) {
            const entity = constraint.entities[i];
            const target = constraint.fixedTargets[i];

            // Step 1: Position fix via PointPointCoincident
            const virtualPointNode = new THREE.Object3D();
            virtualPointNode.position.copy(target.position);
            const virtualPointEntity = { name: '__virtual_fixed_point__', node: virtualPointNode };

            const positionConstraint = {
                type: 'PointPointCoincident',
                entities: [virtualPointEntity, entity],
                weight: weight
            };
            this.applyPointPointCoincidentConstraint(positionConstraint);

            // Step 2: Orientation fix via two PlanePlaneParallel constraints (Z and X axes)
            const targetNormalZ = new THREE.Vector3(0, 0, 1).applyQuaternion(target.quaternion);
            const targetNormalX = new THREE.Vector3(1, 0, 0).applyQuaternion(target.quaternion);

            const virtualPlaneZ = this.createVirtualPlaneEntity(targetNormalZ, target.position, '__virtual_fixed_plane_z__');
            const virtualPlaneX = this.createVirtualPlaneEntity(targetNormalX, target.position, '__virtual_fixed_plane_x__');

            const orientationConstraintZ = {
                type: 'PlanePlaneParallel',
                entities: [virtualPlaneZ, entity],
                weight: weight
            };
            const orientationConstraintX = {
                type: 'PlanePlaneParallel',
                entities: [virtualPlaneX, entity],
                weight: weight
            };

            this.applyPlanePlaneParallelConstraint(orientationConstraintZ);
            this.applyPlanePlaneParallelConstraint(orientationConstraintX);
        }
    }

    /**
     * FixedJoint Constraint: Fix a pivot point in place, optionally constrain rotation to a plane.
     * If a plane is provided (via value.planeNormal), the part's referencePlane is aligned
     * to be parallel with that plane, allowing rotation about the plane normal.
     */
    applyFixedJointConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        const weight = constraint.weight ?? 1.0;

        if (!constraint.fixedTargets || constraint.fixedTargets.length !== constraint.entities.length) {
            console.warn(`[Gripper Constraints] FixedJoint constraint is missing target transforms: ${constraint.id}`);
            return;
        }

        for (let i = 0; i < constraint.entities.length; i++) {
            const entity = constraint.entities[i];
            const target = constraint.fixedTargets[i];

            // 1) Fix pivot point position
            const virtualPointNode = new THREE.Object3D();
            virtualPointNode.position.copy(target.position);
            const virtualPointEntity = { name: '__virtual_fixed_joint_point__', node: virtualPointNode };

            const refPointDef = constraint.referencePoints?.[i] || null;
            const positionConstraint = {
                type: 'PointPointCoincident',
                entities: [virtualPointEntity, entity],
                referencePoints: refPointDef ? [null, refPointDef] : null,
                entityWeights: [0.0, 1.0],
                weight: weight
            };
            this.applyPointPointCoincidentConstraint(positionConstraint);

            // 2) Optional rotation plane constraint
            if (target.planeNormal) {
                if (!target.referencePlane) {
                    console.warn(`[Gripper Constraints] FixedJoint '${constraint.id}' has planeNormal but no referencePlane for entity '${entity.name}'.`);
                    continue;
                }

                const virtualPlane = this.createVirtualPlaneEntity(
                    target.planeNormal,
                    target.planePoint ?? target.position,
                    '__virtual_fixed_joint_plane__'
                );

                const planeConstraint = {
                    type: 'PlanePlaneParallel',
                    entities: [virtualPlane, entity],
                    referencePlanes: [null, target.referencePlane],
                    weight: weight
                };

                this.applyPlanePlaneParallelConstraint(planeConstraint);
            }
        }
    }

    /**
     * Joint Constraint: Constrain two parts to rotate in a specified plane,
     * while keeping joint center points coincident or at a specified offset
     * along the plane normal.
     */
    applyJointConstraint(constraint) {
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
                const planeWorld = this.getReferencePlaneWorld(entityA.name, planeName);
                if (planeWorld) {
                    planeNormal = planeWorld.normal.clone();
                    planePoint = planeWorld.point.clone();
                }
            }
        }

        if (!planeNormal) {
            console.warn(`[Gripper Constraints] Joint '${constraint.id}' missing planeNormal or referencePlane.`);
            return;
        }

        if (!planePoint) {
            planePoint = entityA.node.getWorldPosition(new THREE.Vector3());
        }

        // 1) Constrain both entities to rotate in the plane (align referencePlane if provided)
        const virtualPlane = this.createVirtualPlaneEntity(planeNormal, planePoint, '__virtual_joint_plane__');

        const refPlaneAName = constraint.referencePlanes?.[0] || null;
        if (refPlaneAName) {
            this.applyPlanePlaneParallelConstraint({
                type: 'PlanePlaneParallel',
                entities: [virtualPlane, entityA],
                referencePlanes: [null, refPlaneAName],
                weight
            });
        }

        const refPlaneBName = constraint.referencePlanes?.[1] || null;
        if (refPlaneBName) {
            this.applyPlanePlaneParallelConstraint({
                type: 'PlanePlaneParallel',
                entities: [virtualPlane, entityB],
                referencePlanes: [null, refPlaneBName],
                weight
            });
        }

        // 2) Enforce perpendicular distance between joint centers along plane normal
        const coincident = constraint.value?.coincident ?? false;
        const offset = coincident ? 0.0 : (constraint.value?.offset ?? constraint.value?.distance ?? 0.0);

        let pivotA = null;
        const refPointA = constraint.referencePoints?.[0];
        if (refPointA?.name) {
            pivotA = this.getReferencePointWorldPosition(entityA.name, refPointA.name);
        }
        if (!pivotA) {
            pivotA = entityA.node.getWorldPosition(new THREE.Vector3());
        }

        const planePointForB = pivotA.clone().add(planeNormal.clone().multiplyScalar(offset));
        const virtualPlaneForB = this.createVirtualPlaneEntity(
            planeNormal,
            planePointForB,
            '__virtual_joint_offset_plane__'
        );

        const refPointB = constraint.referencePoints?.[1] || null;
        this.applyPointPlaneConstraint({
            type: 'PointPlane',
            entities: [entityB, virtualPlaneForB],
            referencePoints: refPointB ? [refPointB, null] : null,
            weight
        });
    }

    /**
     * Main update loop - called periodically during simulation.
     * Updates both state and display from the board state.
     * 
     * IMPORTANT: Skips entire update (state + display) if model reload is in progress.
     * This prevents any state changes from being applied while joints are being rebuilt.
     * 
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    updateScenario(boardState) {
        // Block the entire update cycle during model reload to prevent inconsistent state
        if (this.isModelReloading) {
            console.log('[Gripper] Skipping updateScenario during model reload');
            return;
        }
        
        super.updateScenario(boardState);
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
    }

    /**
     * Update the simulation state from board state.
     * Reads servo angles and applies them to joints, then applies constraints.
     * 
     * IMPORTANT: Skips update if model reload is in progress to prevent race conditions.
     * 
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    updateScenarioState(boardState) {
        // Skip updates while model reload is in progress
        if (this.isModelReloading) {
            console.log('[Gripper] Skipping updateScenarioState during model reload');
            return;
        }
        
        super.updateScenarioState(boardState);
        this.updateTargetServoAngles(boardState);
        this.updateSmoothedServoAngles();
        this.applyServoState(boardState);
        this.applyConstraints();
    }

    /**
     * Update the visual display.
     * Triggers a new render of the 3D scene.
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    updateScenarioDisplay(boardState) {
        super.updateScenarioDisplay(boardState);
        this.renderScene();
    }

    /**
     * Apply servo angles from board state to 3D joint rotations.
     * This is the core of the kinematic mapping:
     * 1. Read servo angle from board state
     * 2. Map servo range to joint angle range using linear interpolation
     * 3. Get rotation axis point (from reference point if specified)
     * 4. Apply rotation around that point
     * 5. Combine with base rotation to get final orientation
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    applyServoState(boardState) {
        if (this.joints.length === 0) {
            return;
        }

        for (let jointBinding of this.joints) {
            let descriptor = jointBinding.descriptor;
            // Get servo configuration from descriptor
            let servoIndex = descriptor?.servo?.index ?? 1;
            let servoMin = descriptor?.servo?.min ?? 0;
            let servoMax = descriptor?.servo?.max ?? 180;
            let servoInvert = descriptor?.servo?.invert ?? false;
            let servoInitialAngle = descriptor?.servo?.initialAngle ?? 0;

            // Read current (smoothed) servo angle from the internal state
            let servoAngle = this.getSmoothedServoAngle(servoIndex, boardState);

            
            // Map servo angle [servoMin, servoMax] to normalized range [0, 1]
            let t = 0;
            if (servoMax !== servoMin) {
                t = (servoAngle - servoMin) / (servoMax - servoMin);
            }
            t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
            if (servoInvert) {
                t = 1 - t; // Invert servo for opposite rotation direction
            }

            // Map normalized value to joint angle range
            let minDeg = descriptor?.minDeg ?? 0;
            let maxDeg = descriptor?.maxDeg ?? 0;
            let jointAngleDeg = minDeg + t * (maxDeg - minDeg);

            // Subtract initial angle to get relative rotation from the base pose
            jointAngleDeg -= servoInitialAngle;
            
            // Create rotation axis in world space
            let axisValues = descriptor?.axis ?? [0, 0, 1];
            let axis = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]);
            if (axis.length() === 0) {
                axis.set(0, 0, 1); // Default to Z-axis
            }
            axis.normalize();
            // Transform axis from part's local space to world space
            axis.applyQuaternion(jointBinding.baseWorldQuaternion);
            
            // DYNAMIC PARENT ROTATION: If this joint's node has a parent, adjust axis based on parent's current rotation
            if (jointBinding.node.parent) {
                const parentCurrentQuat = new THREE.Quaternion();
                jointBinding.node.parent.getWorldQuaternion(parentCurrentQuat);
                
                // Calculate how much the parent has rotated from its initial state
                const parentRotationDelta = parentCurrentQuat.clone()
                    .multiply(jointBinding.parentBaseWorldQuat.clone().invert());
                
                // Apply parent's rotation delta to the axis vector
                axis.applyQuaternion(parentRotationDelta);
            }
            
            let rotation = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(jointAngleDeg));
            
            // For child nodes with a parent, recalculate base position based on parent's current transform
            let effectiveBaseWorldPos = jointBinding.baseWorldPosition.clone();
            let effectiveBaseWorldQuat = jointBinding.baseWorldQuaternion.clone();
            let effectiveAxisPointWorld = jointBinding.axisPointWorld?.clone() || null;
            
            if (jointBinding.node.parent) {
                // Calculate child's local position/rotation relative to parent (using initial transforms)
                const parentInitialQuat = jointBinding.parentBaseWorldQuat;
                const parentInitialPos = jointBinding.parentBaseWorldPos;
                
                // Child's local position relative to parent (in parent's initial frame)
                const childLocalPosInParentFrame = jointBinding.baseWorldPosition.clone()
                    .sub(parentInitialPos)
                    .applyQuaternion(parentInitialQuat.clone().invert());
                
                // Child's local rotation relative to parent (in parent's initial frame)
                const childLocalQuatInParentFrame = parentInitialQuat.clone()
                    .invert()
                    .multiply(jointBinding.baseWorldQuaternion);
                
                // Get parent's CURRENT transform
                const parentCurrentPos = new THREE.Vector3();
                const parentCurrentQuat = new THREE.Quaternion();
                jointBinding.node.parent.getWorldPosition(parentCurrentPos);
                jointBinding.node.parent.getWorldQuaternion(parentCurrentQuat);
                
                // Transform child's local coords to parent's CURRENT frame
                effectiveBaseWorldPos = childLocalPosInParentFrame.clone()
                    .applyQuaternion(parentCurrentQuat)
                    .add(parentCurrentPos);
                
                effectiveBaseWorldQuat = parentCurrentQuat.clone()
                    .multiply(childLocalQuatInParentFrame);
                
                // Also recalculate axis point if it exists (transform it through child's current frame)
                if (jointBinding.axisPointLocal) {
                    // Axis point is defined in the CHILD node's local coordinates
                    // Apply the child's CURRENT world transform (after rotation) to the local axis point
                    effectiveAxisPointWorld = jointBinding.axisPointLocal.clone()
                        .applyQuaternion(effectiveBaseWorldQuat)
                        .add(effectiveBaseWorldPos);
                }
            }
            
            // Apply rotation in world space
            if (effectiveAxisPointWorld) {
                // Rotate around arbitrary point in world space
                // Vector from axis point to part's effective world position
                const relativePos = effectiveBaseWorldPos.clone().sub(effectiveAxisPointWorld);
                
                // Apply rotation to relative position
                relativePos.applyQuaternion(rotation);
                
                // New world position after rotation around axis
                const newWorldPos = effectiveAxisPointWorld.clone().add(relativePos);
                
                // New world rotation: apply rotation increment to effective rotation
                const newWorldQuat = effectiveBaseWorldQuat.clone().multiply(rotation);
                
                // Apply world transform
                this.applyWorldTransform(jointBinding.node, newWorldPos, newWorldQuat);
            } else {
                // Rotate around part's center point in world space
                const newWorldQuat = effectiveBaseWorldQuat.clone().multiply(rotation);
                this.applyWorldTransform(jointBinding.node, effectiveBaseWorldPos, newWorldQuat);
            }
            
            // Invalidate reference point cache since this joint moved
            this.invalidateReferencePointCache(descriptor?.node);
        }
    }

    /**
     * Seed the smoothing maps with initial servo angles when the simulation is reset.
     * Uses descriptor-defined initial values if provided, otherwise defaults to the midpoint
     * of the servo range (typically 90 degrees for 0-180 servos).
     */
    seedServoAnglesFromDescriptor() {
        if (!this.kinematicsDescriptor || !this.kinematicsDescriptor.joints) {
            return;
        }
        for (let joint of this.kinematicsDescriptor.joints) {
            let servoIndex = joint?.servo?.index ?? 1;
            // Use explicit initial value, or default to midpoint of servo range
            let initialAngle = joint?.servo?.initial;
            if (initialAngle === undefined) {
                let servoMin = joint?.servo?.min ?? 0;
                let servoMax = joint?.servo?.max ?? 180;
                initialAngle = (servoMin + servoMax) / 2; // Midpoint default (typically 90°)
            }
            this.currentServoAngles.set(servoIndex, initialAngle);
            this.targetServoAngles.set(servoIndex, initialAngle);
        }
    }

    /**
     * Reset the model joints to their original orientation as loaded.
     * Parts are restored to their initial world-space position and rotation.
     * Local coordinates remain unchanged.
     */
    resetModelPose() {
        for (let jointBinding of this.joints) {
            // Restore to initial world-space transform
            this.applyWorldTransform(
                jointBinding.node,
                jointBinding.baseWorldPosition,
                jointBinding.baseWorldQuaternion
            );
        }

        // For child nodes with parents, restore their local coordinates
        for (let jointBinding of this.joints) {
            if (jointBinding.node.parent && jointBinding.parentBaseWorldPos && jointBinding.parentBaseWorldQuat) {
                const parentInitialQuat = jointBinding.parentBaseWorldQuat;
                const parentInitialPos = jointBinding.parentBaseWorldPos;
                
                // Recalculate local position from initial world transforms
                const localPos = jointBinding.baseWorldPosition.clone()
                    .sub(parentInitialPos)
                    .applyQuaternion(parentInitialQuat.clone().invert());
                
                // Recalculate local rotation from initial world transforms
                const localQuat = parentInitialQuat.clone()
                    .invert()
                    .multiply(jointBinding.baseWorldQuaternion);
                
                // Apply local coordinates
                jointBinding.node.position.copy(localPos);
                jointBinding.node.quaternion.copy(localQuat);
            }
        }
    }

    /**
     * Reload the model and descriptor from their stored sources.
     * This performs a clean reset by reloading from files instead of just rotating joints.
     * Called by resetScenario to ensure a complete reset to initial state.
     * 
     * Uses async/await to ensure servo angles are seeded only AFTER joints are fully initialized.
     * Sets isModelReloading flag to prevent updateScenarioState from interfering during reload.
     */
    async reloadModelAndDescriptor() {
        this.isModelReloading = true;
        console.log('[Gripper] Starting model and descriptor reload...');
        
        try {
            if (this.isUsingCustomModel && this.currentModelFile) {
                // Reload custom model from stored file blob
                console.log('[Gripper] Reloading custom model');
                try {
                    const gltf = await this._loadGLTF(this.currentModelFile);
                    this.currentModelRoot = gltf.scene;
                    this.setModel(gltf.scene);
                    console.log('[Gripper] ✓ Custom model reloaded');
                } catch (error) {
                    console.error('[Gripper] Failed to reload custom model:', error);
                    // Fallback to default model on error
                    this.loadDefaultModel();
                }
            } else {
                // Reload default model (synchronous)
                console.log('[Gripper] Reloading default model');
                this.loadDefaultModel();
            }
            
            // Reload descriptor
            if (this.isUsingCustomDescriptor && this.currentDescriptor) {
                console.log('[Gripper] Reloading custom descriptor');
                this.kinematicsDescriptor = JSON.parse(JSON.stringify(this.currentDescriptor));
            } else {
                console.log('[Gripper] Reloading default descriptor');
                this.kinematicsDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
                this.currentDescriptor = JSON.parse(JSON.stringify(DEFAULT_KINEMATICS_DESCRIPTOR));
            }
            
            this.applyKinematicsDescriptor();
            console.log('[Gripper] ✓ Model and descriptor reloaded, seeding angles...');
            
            // CRITICAL: Seed angles WHILE flag is still true to prevent updateScenarioState interference
            this.seedServoAnglesFromDescriptor();
            console.log('[Gripper] ✓ Servo angles seeded');
        } finally {
            // Clear flag only AFTER all initialization is complete
            this.isModelReloading = false;
            console.log('[Gripper] Model reload complete, state updates resumed');
        }
    }

    /**
     * Promisify the GLTFLoader to work with async/await.
     * @param {File} file - The GLB file to load
     * @returns {Promise} Resolves with loaded GLTF or rejects on error
     */
    _loadGLTF(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            this.gltfLoader.load(
                url,
                (gltf) => {
                    URL.revokeObjectURL(url);
                    resolve(gltf);
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
     * Update the target servo angles from the board state.
     * Skips the first few updates to avoid initialization glitches (transient zero-angle pulses).
     * @param {BoardState} boardState - Current board state
     */
    updateTargetServoAngles(boardState) {
        if (!boardState) {
            return;
        }
        
        // Increment counter and skip first few updates to filter out initialization glitches
        this.updateCounter++;
        if (this.updateCounter <= this.initializationSkipCount) {
            console.log(`[Gripper] Skipping update ${this.updateCounter}/${this.initializationSkipCount} (filtering initialization glitches)`);
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
     * Smoothly update current servo angles toward their targets over time.
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
     * Get the current smoothed servo angle for a servo index.
     * Falls back to board state if smoothing is not initialized.
     * @param {number} servoIndex - Servo index to query
     * @param {BoardState} boardState - Current board state
     * @returns {number} Smoothed servo angle in degrees
     */
    getSmoothedServoAngle(servoIndex, boardState) {
        if (this.currentServoAngles.has(servoIndex)) {
            return this.currentServoAngles.get(servoIndex);
        }
        return this.getServoAngle(boardState, servoIndex);
    }

    /**
     * Safely retrieve servo angle from board state.
     * Returns 0 if the angle is unavailable or invalid.
     * @param {BoardState} boardState - Current board state
     * @param {number} servoIndex - Index of the servo to read
     * @returns {number} Servo angle in degrees
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
     * Render the current frame of the 3D scene.
     * Called whenever the scene state changes.
     */
    renderScene() {
        if (!this.renderer || !this.scene || !this.camera) {
            return;
        }
        // Update controls to apply any pending camera movements
        if (this.controls) {
            this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle container resize events.
     * Updates camera aspect ratio and renderer size to match the new container dimensions.
     */
    handleResize() {
        if (!this.renderer || !this.camera) {
            return;
        }
        let width = this.container.width();
        let height = this.container.height();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderScene();
    }

    /**
     * Reset the scenario to initial state.
     * Reloads the model from the GLB file and descriptor from the descriptor file.
     * This ensures a clean reset, avoiding issues with accumulated constraint violations.
     * 
     * IMPORTANT: This method must remain synchronous to honor the interface contract.
     * The async model reload happens in the background (fire-and-forget pattern).
     * The isModelReloading flag prevents updateScenarioState from interfering during reload.
     */
    resetScenario() {
        super.resetScenario();
        this.currentServoAngles.clear();
        this.targetServoAngles.clear();
        this.lastUpdateTimestampMs = null;
        this.updateCounter = 0; // Reset counter on scenario reset
        
        // Fire off async reload in background (don't await - must remain sync for interface)
        // Note: Angle seeding now happens inside reloadModelAndDescriptor while flag is still true
        this.reloadModelAndDescriptor().then(() => {
            // Render scene after all initialization is complete and flag is cleared
            this.renderScene();
            console.log('[Gripper] Reset complete');
        }).catch(error => {
            console.error('[Gripper] Error during reset:', error);
            // On error, still render to show current state
            this.renderScene();
        });
    }

    /**
     * Set whether the simulation is currently running.
     * @param {boolean} isSimulationRunning - True if simulation is active
     */
    setIsSimulationRunning(isSimulationRunning) {
        this.isSimulationRunning = isSimulationRunning;
    }

    /**
     * Cleanup and destroy the scenario.
     * Called when the user switches away from this scenario.
     * Stops the animation loop and disposes of Three.js resources to prevent memory leaks.
     */
    destroy() {
        // Stop the continuous animation loop
        this.stopAnimationLoop();

        // Stop observing container resize events
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Dispose of Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
            this.renderer = null;
        }

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
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

        if (this.camera) {
            this.camera = null;
        }

        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
    }
}

export default DwenguinoSimulationScenarioGripper;