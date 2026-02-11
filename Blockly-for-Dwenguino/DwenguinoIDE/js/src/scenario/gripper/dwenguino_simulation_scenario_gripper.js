import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DwenguinoSimulationScenario from "../dwenguino_simulation_scenario.js";

/**
 * Default kinematics descriptor that maps servo angles to 3D model joint rotations.
 * This descriptor defines:
 * - Model properties (scale, axis orientation)
 * - Joint definitions with their rotation axes, angle ranges, and servo mappings
 * - SolidWorks constraints (Horizontal, Vertical, Collinear, Perpendicular, Parallel, Tangent, Concentric, Coincident, Equal)
 * 
 * The descriptor allows for extensibility - users can upload custom JSON files
 * to define different gripper configurations, servo mappings, and mechanical constraints
 * exported directly from SolidWorks.
 */
const DEFAULT_KINEMATICS_DESCRIPTOR = {
    version: 1,
    model: {
        upAxis: "Y",
        scale: 1
    },
    joints: [
        {
            name: "jaw_left",
            node: "jaw_left",
            type: "revolute",
            axis: [0, 0, -1],
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
        enableConflictDetection: true   // Warn about conflicting constraints
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
     * - Upload custom JSON kinematic descriptors with servo mappings and SolidWorks constraints
     * - Reset to the default gripper configuration
     * 
     * CONSTRAINT DESCRIPTOR FORMAT EXAMPLE:
     * {
     *   "constraintSolver": {
     *     "maxIterations": 10,
     *     "convergenceThreshold": 0.001,
     *     "enableConflictDetection": true
     *   },
     *   "constraints": [
     *     {
     *       "id": "parallel_jaws",
     *       "type": "Parallel",
     *       "entities": ["jaw_left", "jaw_right"],
     *       "weight": 1.0,
     *       "description": "Keep both jaws parallel during motion"
     *     },
     *     {
     *       "id": "coincident_centers",
     *       "type": "Concentric",
     *       "entities": ["jaw_left", "jaw_right"],
     *       "weight": 0.8,
     *       "description": "Jaws rotate about same center point (soft constraint)"
     *     },
     *     {
     *       "id": "horizontal_base",
     *       "type": "Horizontal",
     *       "entities": ["base"],
     *       "weight": 1.0,
     *       "description": "Base platform remains horizontal"
     *     }
     *   ]
     * }
     * 
     * CONSTRAINT WEIGHTS:
     * - weight: 0.0 to 1.0 (default: 1.0 for hard constraints)
     * - 1.0 = hard constraint (100% enforcement)
     * - 0.5 = soft constraint (50% enforcement)
     * - Constraints are sorted by weight (higher weight = higher priority)
     * 
     * ITERATIVE SOLVER:
     * - Applies constraints repeatedly until convergence or max iterations reached
     * - maxIterations: 1-20 (default: 10) - higher = more accurate but slower
     * - convergenceThreshold: 0.0001-0.01 (default: 0.001) - smaller = more precise
     * 
     * CONFLICT DETECTION:
     * - Automatically detects contradictory constraints (e.g., parallel + perpendicular)
     * - Warns about over-constrained entities (more than 3 constraints per entity)
     * - Check browser console for conflict warnings
     * 
     * SUPPORTED CONSTRAINT TYPES (from SolidWorks):
     * - Horizontal: Edge/plane is horizontal (parallel to XZ plane)
     * - Vertical: Edge/plane is vertical (parallel to Y-axis)
     * - Collinear: Multiple edges/points lie on same line
     * - Perpendicular: Two edges are 90° apart
     * - Parallel: Two edges/planes have same orientation
     * - Tangent: Curves/surfaces touch without penetration
     * - Concentric: Multiple elements share same center point
     * - Coincident: Points/edges occupy same location
     * - Equal: Elements have equal dimensions or radii
     * 
     * HOW TO EXPORT CONSTRAINTS FROM SOLIDWORKS:
     * 1. In SolidWorks, create your assembly with constrained parts
     * 2. Note the constraint names and types from the assembly tree
     * 3. Export to GLB format (File > Save As > Save as type: GLTF Binary (.glb))
     * 4. Create JSON descriptor manually mapping SolidWorks constraints to part names
     * 5. Assign weights to constraints (1.0 for critical, lower for soft constraints)
     * 6. Upload both GLB and descriptor JSON files to the simulator
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
     * Supports both uncompressed and DRACO-compressed GLB files from SolidWorks.
     * @param {Event} event - File input change event
     */
    handleModelUpload(event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        
        console.log(`[Gripper] Loading GLB model: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        
        // Create temporary URL for the file blob
        let url = URL.createObjectURL(file);
        this.gltfLoader.load(
            url,
            (gltf) => {
                // Clean up the temporary URL after loading
                URL.revokeObjectURL(url);
                // Replace the current model with the loaded one
                this.setModel(gltf.scene);
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
            }
        );
    }

    /**
     * Handle user upload of a custom JSON kinematics descriptor.
     * The descriptor defines how servo angles map to 3D joint rotations.
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
                this.applyKinematicsDescriptor();
                this.renderScene();
            } catch (error) {
                console.error("Invalid kinematics JSON", error);
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
        // Remove previous model if it exists
        if (this.modelRoot) {
            this.scene.remove(this.modelRoot);
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
     * Apply model-level transformations (scale, axis orientation).
     * Handles different CAD export conventions (Y-up vs Z-up).
     */
    applyModelTransform() {
        if (!this.modelRoot) {
            return;
        }
        // Apply uniform scale from descriptor
        let scale = this.kinematicsDescriptor?.model?.scale ?? 1;
        this.modelRoot.scale.set(scale, scale, scale);

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
        // Clear previous joint mappings
        this.joints = [];
        if (!this.modelRoot || !this.kinematicsDescriptor || !this.kinematicsDescriptor.joints) {
            return;
        }

        // Ensure model transforms are current
        this.applyModelTransform();

        // Map each joint descriptor to its corresponding 3D node
        for (let joint of this.kinematicsDescriptor.joints) {
            let node = this.modelRoot.getObjectByName(joint.node);
            if (!node) {
                console.warn(`Joint node not found: ${joint.node}`);
                continue;
            }
            if (!node.userData.initialQuaternion) {
                node.userData.initialQuaternion = node.quaternion.clone();
            }
            // Store joint binding with base quaternion for relative rotations
            this.joints.push({
                descriptor: joint,
                node: node,
                baseQuaternion: node.userData.initialQuaternion.clone() // Preserve original rotation
            });
        }

        // Initialize SolidWorks constraints from descriptor
        this.initializeConstraints();
    }

    /**
     * Initialize and validate SolidWorks constraints from descriptor.
     * Parses solver configuration, validates constraint weights, and detects conflicts.
     * Supported constraint types:
     * - Horizontal: Forces edge/plane to be horizontal
     * - Vertical: Forces edge/plane to be vertical
     * - Collinear: Forces edges/points to be on same line
     * - Perpendicular: Forces elements to be perpendicular (90°)
     * - Parallel: Forces elements to be parallel
     * - Tangent: Forces curves/surfaces to be tangent
     * - Concentric: Forces elements to share same center
     * - Coincident: Forces points/edges to occupy same location
     * - Equal: Forces equal dimensions or radii
     */
    initializeConstraints() {
        this.constraints = [];
        this.constraintConflicts = [];
        
        // Parse solver configuration
        if (this.kinematicsDescriptor?.constraintSolver) {
            const config = this.kinematicsDescriptor.constraintSolver;
            this.maxConstraintIterations = config.maxIterations ?? 10;
            this.convergenceThreshold = config.convergenceThreshold ?? 0.001;
            this.enableConflictDetection = config.enableConflictDetection ?? true;
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

            // Resolve entity references to Three.js nodes
            let resolvedEntities = [];
            for (let entityName of constraintDef.entities) {
                let entity = this.modelRoot.getObjectByName(entityName);
                if (!entity) {
                    console.warn(`[Gripper Constraints] Constraint entity not found: ${entityName}`);
                    continue;
                }
                resolvedEntities.push({ name: entityName, node: entity });
            }

            if (resolvedEntities.length < (constraintDef.entities?.length || 0)) {
                console.warn(`[Gripper Constraints] Some entities not found for constraint:`, constraintDef);
                continue;
            }

            // Parse and validate weight (default to 1.0 for hard constraints)
            let weight = constraintDef.weight ?? 1.0;
            if (typeof weight !== 'number' || weight < 0 || weight > 1) {
                console.warn(`[Gripper Constraints] Invalid weight ${weight} for constraint '${constraintDef.id}', using 1.0`);
                weight = 1.0;
            }

            // Store validated constraint
            this.constraints.push({
                id: constraintDef.id || `constraint_${this.constraints.length}`,
                type: constraintDef.type,
                entities: resolvedEntities,
                weight: weight,
                value: constraintDef.value,
                definition: constraintDef
            });
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
        // Parallel + Perpendicular conflict
        if ((c1.type === 'Parallel' && c2.type === 'Perpendicular') ||
            (c1.type === 'Perpendicular' && c2.type === 'Parallel')) {
            return 'Cannot be both parallel and perpendicular';
        }

        // Horizontal + Vertical conflict
        if ((c1.type === 'Horizontal' && c2.type === 'Vertical') ||
            (c1.type === 'Vertical' && c2.type === 'Horizontal')) {
            return 'Cannot be both horizontal and vertical';
        }

        // Multiple Coincident/Concentric constraints on same entities
        if ((c1.type === 'Coincident' && c2.type === 'Concentric') ||
            (c1.type === 'Concentric' && c2.type === 'Coincident')) {
            if (sharedEntities.length === c1.entities.length && sharedEntities.length === c2.entities.length) {
                return 'Redundant positional constraints';
            }
        }

        // Collinear + Perpendicular conflict
        if ((c1.type === 'Collinear' && c2.type === 'Perpendicular') ||
            (c1.type === 'Perpendicular' && c2.type === 'Collinear')) {
            return 'Collinear entities cannot be perpendicular';
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
            // Apply all constraints in priority order
            for (let constraint of sortedConstraints) {
                this.applyConstraintWithWeight(constraint);
            }

            // Check for convergence
            const currentState = this.captureEntityState();
            const maxDelta = this.computeMaxStateDelta(previousState, currentState);

            if (maxDelta < this.convergenceThreshold) {
                // Converged!
                if (iteration > 0) {
                    console.log(`[Gripper Constraints] Converged in ${iteration + 1} iterations (delta: ${maxDelta.toFixed(6)})`);
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
     * Apply a single constraint with weight factor.
     * Weight allows for soft constraints (partial enforcement).
     */
    applyConstraintWithWeight(constraint) {
        switch (constraint.type.toUpperCase()) {
            case "HORIZONTAL":
                this.applyHorizontalConstraint(constraint);
                break;
            case "VERTICAL":
                this.applyVerticalConstraint(constraint);
                break;
            case "COLLINEAR":
                this.applyCollinearConstraint(constraint);
                break;
            case "PERPENDICULAR":
                this.applyPerpendicularConstraint(constraint);
                break;
            case "PARALLEL":
                this.applyParallelConstraint(constraint);
                break;
            case "TANGENT":
                this.applyTangentConstraint(constraint);
                break;
            case "CONCENTRIC":
                this.applyConcentriConstraint(constraint);
                break;
            case "COINCIDENT":
                this.applyCoincidentConstraint(constraint);
                break;
            case "EQUAL":
                this.applyEqualConstraint(constraint);
                break;
            default:
                console.warn(`[Gripper Constraints] Unknown constraint type: ${constraint.type}`);
        }
    }

    /**
     * Horizontal Constraint: Forces an edge or plane normal to be horizontal (parallel to XZ plane).
     * Applied to single entity's normal vector.
     */
    applyHorizontalConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        let entity = constraint.entities[0].node;
        const weight = constraint.weight ?? 1.0;

        // Get entity's local normal (typically Z-axis in local space)
        let localNormal = new THREE.Vector3(0, 0, 1);
        let worldNormal = localNormal.clone().applyQuaternion(entity.quaternion);

        // If normal is not horizontal, rotate to make it so
        let horizontalNormal = new THREE.Vector3(worldNormal.x, 0, worldNormal.z);
        if (horizontalNormal.lengthSq() > 0.001) {
            horizontalNormal.normalize();
            let rotation = new THREE.Quaternion().setFromUnitVectors(worldNormal.normalize(), horizontalNormal);
            // Apply weight by lerping between identity and target rotation
            if (weight < 1.0) {
                rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
            }
            entity.quaternion.multiplyQuaternions(rotation, entity.quaternion);
        }
    }

    /**
     * Vertical Constraint: Forces an edge or plane normal to be vertical (parallel to Y-axis).
     */
    applyVerticalConstraint(constraint) {
        if (constraint.entities.length < 1) return;
        let entity = constraint.entities[0].node;
        const weight = constraint.weight ?? 1.0;

        let localNormal = new THREE.Vector3(0, 0, 1);
        let worldNormal = localNormal.clone().applyQuaternion(entity.quaternion).normalize();

        // Target is vertical (along Y)
        let verticalNormal = new THREE.Vector3(0, Math.sign(worldNormal.y) || 1, 0);

        if (Math.abs(worldNormal.y) < 0.99) {
            let rotation = new THREE.Quaternion().setFromUnitVectors(worldNormal, verticalNormal);
            if (weight < 1.0) {
                rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
            }
            entity.quaternion.multiplyQuaternions(rotation, entity.quaternion);
        }
    }

    /**
     * Collinear Constraint: Forces multiple edges or points to lie on the same line.
     * Aligns all entity normals with the first entity's normal.
     */
    applyCollinearConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        let referenceEntity = constraint.entities[0].node;
        let referenceNormal = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(referenceEntity.quaternion).normalize();

        for (let i = 1; i < constraint.entities.length; i++) {
            let entity = constraint.entities[i].node;
            let entityNormal = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity.quaternion).normalize();

            if (entityNormal.dot(referenceNormal) < 0.99) {
                let rotation = new THREE.Quaternion().setFromUnitVectors(entityNormal, referenceNormal);
                if (weight < 1.0) {
                    rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
                }
                entity.quaternion.multiplyQuaternions(rotation, entity.quaternion);
            }
        }
    }

    /**
     * Perpendicular Constraint: Forces two edges to be perpendicular (90° angle).
     * Rotates second entity so its normal is perpendicular to first entity's normal.
     */
    applyPerpendicularConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        let entity1 = constraint.entities[0].node;
        let entity2 = constraint.entities[1].node;

        let normal1 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity1.quaternion).normalize();
        let normal2 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity2.quaternion).normalize();

        // Find perpendicular direction
        let perpendicular = new THREE.Vector3().crossVectors(normal1, normal2);
        if (perpendicular.lengthSq() > 0.001) {
            perpendicular.normalize();
            let rotation = new THREE.Quaternion().setFromUnitVectors(normal2, perpendicular);
            if (weight < 1.0) {
                rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
            }
            entity2.quaternion.multiplyQuaternions(rotation, entity2.quaternion);
        }
    }

    /**
     * Parallel Constraint: Forces two edges or planes to be parallel.
     * Aligns normals of both entities.
     */
    applyParallelConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        let entity1 = constraint.entities[0].node;
        let entity2 = constraint.entities[1].node;

        let normal1 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity1.quaternion).normalize();
        let normal2 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity2.quaternion).normalize();

        // Check both parallel and anti-parallel directions
        let dot = normal1.dot(normal2);
        let targetNormal = Math.abs(dot) > 0.99 ? normal1 : (dot > 0 ? normal1.clone() : normal1.clone().negate());

        if (Math.abs(normal2.dot(targetNormal)) < 0.99) {
            let rotation = new THREE.Quaternion().setFromUnitVectors(normal2, targetNormal);
            if (weight < 1.0) {
                rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
            }
            entity2.quaternion.multiplyQuaternions(rotation, entity2.quaternion);
        }
    }

    /**
     * Tangent Constraint: Forces two curves or surfaces to be tangent.
     * Aligns normals at contact point.
     */
    applyTangentConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        let entity1 = constraint.entities[0].node;
        let entity2 = constraint.entities[1].node;

        let normal1 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity1.quaternion).normalize();
        let normal2 = new THREE.Vector3(0, 0, 1).clone().applyQuaternion(entity2.quaternion).normalize();

        // For tangent, normals should be aligned
        if (normal1.dot(normal2) < 0.99) {
            let rotation = new THREE.Quaternion().setFromUnitVectors(normal2, normal1);
            if (weight < 1.0) {
                rotation.slerp(new THREE.Quaternion(), 1.0 - weight);
            }
            entity2.quaternion.multiplyQuaternions(rotation, entity2.quaternion);
        }
    }

    /**
     * Concentric Constraint: Forces two or more entities to share the same center point.
     * Moves entities' positions to align their centers.
     */
    applyConcentriConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        // Get world positions of all entities
        let positions = constraint.entities.map(e => {
            let pos = new THREE.Vector3();
            e.node.getWorldPosition(pos);
            return pos;
        });

        // Calculate average center
        let center = new THREE.Vector3();
        for (let pos of positions) {
            center.add(pos);
        }
        center.divideScalar(positions.length);

        // Move all entities to share the center
        for (let i = 0; i < constraint.entities.length; i++) {
            let entity = constraint.entities[i].node;
            let offset = new THREE.Vector3().subVectors(center, positions[i]);
            // Apply weight to position offset
            offset.multiplyScalar(weight);
            entity.position.add(offset);
        }
    }

    /**
     * Coincident Constraint: Forces points or edges to occupy the same location.
     * Moves entity positions together.
     */
    applyCoincidentConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        // Use first entity as reference
        let referenceEntity = constraint.entities[0].node;
        let referencePos = new THREE.Vector3();
        referenceEntity.getWorldPosition(referencePos);

        // Move all other entities to reference position
        for (let i = 1; i < constraint.entities.length; i++) {
            let entity = constraint.entities[i].node;
            let entityPos = new THREE.Vector3();
            entity.getWorldPosition(entityPos);
            let offset = new THREE.Vector3().subVectors(referencePos, entityPos);
            // Apply weight to position offset
            offset.multiplyScalar(weight);
            entity.position.add(offset);
        }
    }

    /**
     * Equal Constraint: Forces entities to have equal dimensions or radii.
     * Scales entities to match first entity's size.
     */
    applyEqualConstraint(constraint) {
        if (constraint.entities.length < 2) return;
        const weight = constraint.weight ?? 1.0;

        let entity1 = constraint.entities[0].node;
        let entity2 = constraint.entities[1].node;

        // Get bounding boxes to determine scale
        let bbox1 = new THREE.Box3().setFromObject(entity1);
        let bbox2 = new THREE.Box3().setFromObject(entity2);
        let size1 = bbox1.getSize(new THREE.Vector3());
        let size2 = bbox2.getSize(new THREE.Vector3());

        // Use average dimension as reference
        let scale1 = (size1.x + size1.y + size1.z) / 3;
        let scale2 = (size2.x + size2.y + size2.z) / 3;

        if (scale2 > 0.001) {
            let scaleRatio = scale1 / scale2;
            // Apply weight by lerping between current scale (1.0) and target scale
            let weightedScale = 1.0 + (scaleRatio - 1.0) * weight;
            entity2.scale.multiplyScalar(weightedScale);
        }
    }

    /**
     * Main update loop - called periodically during simulation.
     * Updates both state and display from the board state.
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    updateScenario(boardState) {
        super.updateScenario(boardState);
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
    }

    /**
     * Update the simulation state from board state.
     * Reads servo angles and applies them to joints, then applies constraints.
     * @param {BoardState} boardState - Current state of the Dwenguino board
     */
    updateScenarioState(boardState) {
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
     * 3. Apply rotation around the joint's rotation axis
     * 4. Combine with base rotation to get final orientation
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
            let invert = descriptor?.servo?.invert ?? false;

            // Read current (smoothed) servo angle from the internal state
            let servoAngle = this.getSmoothedServoAngle(servoIndex, boardState);
            
            // Map servo angle [servoMin, servoMax] to normalized range [0, 1]
            let t = 0;
            if (servoMax !== servoMin) {
                t = (servoAngle - servoMin) / (servoMax - servoMin);
            }
            t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
            if (invert) {
                t = 1 - t; // Invert for opposite rotation direction
            }

            // Map normalized value to joint angle range
            let minDeg = descriptor?.minDeg ?? 0;
            let maxDeg = descriptor?.maxDeg ?? 0;
            let jointAngleDeg = minDeg + t * (maxDeg - minDeg);
            
            // Create rotation around the joint's axis
            let axisValues = descriptor?.axis ?? [0, 0, 1];
            let axis = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]);
            if (axis.length() === 0) {
                axis.set(0, 0, 1); // Default to Z-axis
            }
            axis.normalize();
            let rotation = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(jointAngleDeg));
            
            // Apply rotation: base rotation * joint rotation
            jointBinding.node.quaternion.copy(jointBinding.baseQuaternion).multiply(rotation);
        }
    }

    /**
     * Seed the smoothing maps with initial servo angles when the simulation is reset.
     * Uses descriptor-defined initial values if provided, otherwise defaults to 0 degrees.
     */
    seedServoAnglesFromDescriptor() {
        if (!this.kinematicsDescriptor || !this.kinematicsDescriptor.joints) {
            return;
        }
        for (let joint of this.kinematicsDescriptor.joints) {
            let servoIndex = joint?.servo?.index ?? 1;
            let initialAngle = joint?.servo?.initial ?? 0;
            this.currentServoAngles.set(servoIndex, initialAngle);
            this.targetServoAngles.set(servoIndex, initialAngle);
        }
    }

    /**
     * Reset the model joints to their original orientation as loaded.
     */
    resetModelPose() {
        for (let jointBinding of this.joints) {
            let initialQuaternion = jointBinding.node.userData.initialQuaternion;
            if (initialQuaternion) {
                jointBinding.node.quaternion.copy(initialQuaternion);
                jointBinding.baseQuaternion = initialQuaternion.clone();
            }
        }
    }

    /**
     * Update the target servo angles from the board state.
     * @param {BoardState} boardState - Current board state
     */
    updateTargetServoAngles(boardState) {
        if (!boardState) {
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
     * Re-applies kinematics and re-renders the scene.
     */
    resetScenario() {
        super.resetScenario();
        this.currentServoAngles.clear();
        this.targetServoAngles.clear();
        this.lastUpdateTimestampMs = null;
        this.applyKinematicsDescriptor();
        this.resetModelPose();
        this.seedServoAnglesFromDescriptor();
        this.applyServoState(null);
        this.renderScene();
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