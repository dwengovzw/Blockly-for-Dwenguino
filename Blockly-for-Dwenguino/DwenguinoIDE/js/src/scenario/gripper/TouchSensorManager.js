import * as THREE from "three";

/**
 * Manages touch sensors defined on the gripper model.
 * Each sensor is a circular contact point attached to a part node,
 * positioned at a reference point with a sensing direction (normal).
 *
 * During each simulation step:
 * 1. Computes the sensor's world position and normal
 * 2. Checks for contact with a graspable object (sphere collision)
 * 3. Computes a force value (0–1023) proportional to penetration depth
 * 4. Writes the force value to boardState via setIoPinState(pin, value)
 */
class TouchSensorManager {
    /** @type {import('./ReferenceGeometry.js').default} */
    refGeometry = null;

    /** @type {Array<Object>} Resolved sensor bindings */
    sensors = [];

    /** @type {THREE.Group|null} Visualization group for sensor discs */
    visualization = null;

    /** @type {number} Maximum analog value (10-bit ADC) */
    static MAX_FORCE = 1023;

    /**
     * @param {import('./ReferenceGeometry.js').default} refGeometry
     */
    constructor(refGeometry) {
        this.refGeometry = refGeometry;
    }

    /**
     * Initialize touch sensors from the descriptor.
     * Resolves node references and creates visual indicators.
     *
     * @param {Object} descriptor - Kinematics descriptor with touchSensors array
     * @param {THREE.Object3D} modelRoot - Root of the 3D model
     * @param {THREE.Scene} scene - Scene to add visualization to
     */
    initialize(descriptor, modelRoot, scene) {
        this.cleanup(scene);
        this.sensors = [];

        if (!descriptor?.touchSensors || !modelRoot) return;

        this.visualization = new THREE.Group();
        this.visualization.name = "__touch_sensor_visualization__";

        const scale = descriptor?.constraintSolver?.referencePointScale ?? 1.0;

        for (const def of descriptor.touchSensors) {
            const node = modelRoot.getObjectByName(def.node);
            if (!node) {
                console.warn(`[TouchSensor] Node not found: ${def.node}`);
                continue;
            }

            const pin = def.pin;
            if (pin === undefined || pin === null) {
                console.warn(`[TouchSensor] No pin defined for sensor: ${def.name}`);
                continue;
            }

            // Resolve the local normal direction
            const normalLocal = new THREE.Vector3(
                def.normal?.[0] ?? 0,
                def.normal?.[1] ?? 1,
                def.normal?.[2] ?? 0
            ).normalize();

            const radius = (def.radius ?? 5) * scale;

            // Store initial node quaternion for normal transformation
            const initialWorldQuat = new THREE.Quaternion();
            node.getWorldQuaternion(initialWorldQuat);

            const sensor = {
                name: def.name || `sensor_${this.sensors.length}`,
                node,
                partName: def.node,
                referencePoint: def.referencePoint || null,
                normalLocal,
                radius,
                pin,
                forceValue: 0,
                mesh: null
            };

            // Create visual disc
            const discGeom = new THREE.CircleGeometry(radius, 24);
            const discMat = new THREE.MeshBasicMaterial({
                color: 0x00cc66,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                depthTest: true
            });
            const disc = new THREE.Mesh(discGeom, discMat);
            disc.name = `__touch_disc_${sensor.name}__`;
            sensor.mesh = disc;

            this.visualization.add(disc);
            this.sensors.push(sensor);

            console.log(`[TouchSensor] Registered sensor '${sensor.name}' on node '${def.node}', pin ${pin}, radius ${radius.toFixed(3)}`);
        }

        if (this.visualization.children.length > 0) {
            scene.add(this.visualization);
        }

        console.log(`[TouchSensor] Initialized ${this.sensors.length} touch sensors`);
    }

    /**
     * Update sensor positions and check for contact with a graspable object.
     * Call this after kinematics + constraint solving, before render.
     *
     * @param {import('./GraspableObject.js').default|null} graspableObject
     */
    update(graspableObject) {
        // Invalidate ref geometry cache for sensor parts so positions are fresh
        for (const sensor of this.sensors) {
            this.refGeometry.invalidateCache(sensor.partName);
        }

        for (const sensor of this.sensors) {
            // Get sensor world position
            const worldPos = this._getSensorWorldPosition(sensor);
            if (!worldPos) continue;

            // Get sensor world normal
            const worldNormal = this._getSensorWorldNormal(sensor);

            // Update visual disc position and orientation
            if (sensor.mesh) {
                sensor.mesh.position.copy(worldPos);
                // Orient disc so its face is perpendicular to the normal
                const lookTarget = worldPos.clone().add(worldNormal);
                sensor.mesh.lookAt(lookTarget);
            }

            // Compute contact force
            sensor.forceValue = 0;
            if (graspableObject && graspableObject.isVisible()) {
                const objPos = graspableObject.getWorldPosition();
                const objRadius = graspableObject.getBoundingRadius();
                if (objPos && objRadius > 0) {
                    sensor.forceValue = this._computeContactForce(
                        worldPos, worldNormal, sensor.radius,
                        objPos, objRadius
                    );
                }
            }

            // Update disc color based on force
            if (sensor.mesh) {
                if (sensor.forceValue > 0) {
                    const intensity = sensor.forceValue / TouchSensorManager.MAX_FORCE;
                    // Green → Red as force increases
                    const r = Math.min(1, intensity * 2);
                    const g = Math.max(0, 1 - intensity * 2);
                    sensor.mesh.material.color.setRGB(r, g, 0);
                    sensor.mesh.material.opacity = 0.6 + 0.4 * intensity;
                } else {
                    sensor.mesh.material.color.setHex(0x00cc66);
                    sensor.mesh.material.opacity = 0.5;
                }
            }
        }
    }

    /**
     * Write all sensor force values to the board state.
     * @param {Object} boardState
     */
    writeToBoard(boardState) {
        if (!boardState) return;
        for (const sensor of this.sensors) {
            boardState.setIoPinState(sensor.pin, sensor.forceValue);
        }
    }

    /**
     * Get the current force values for all sensors.
     * @returns {Array<{name: string, pin: number, force: number}>}
     */
    getSensorReadings() {
        return this.sensors.map(s => ({
            name: s.name,
            pin: s.pin,
            force: s.forceValue
        }));
    }

    /**
     * Get sensor world positions and normals (used by GraspableObject for grip detection).
     * @returns {Array<{position: THREE.Vector3, normal: THREE.Vector3, radius: number, force: number}>}
     */
    getContactInfo() {
        const contacts = [];
        for (const sensor of this.sensors) {
            if (sensor.forceValue <= 0) continue;
            const pos = this._getSensorWorldPosition(sensor);
            const normal = this._getSensorWorldNormal(sensor);
            if (pos && normal) {
                contacts.push({
                    position: pos,
                    normal,
                    radius: sensor.radius,
                    force: sensor.forceValue
                });
            }
        }
        return contacts;
    }

    /**
     * Compute sensor world position from its reference point or node origin.
     * @private
     */
    _getSensorWorldPosition(sensor) {
        if (sensor.referencePoint) {
            const pos = this.refGeometry.getReferencePointWorldPosition(
                sensor.partName, sensor.referencePoint
            );
            if (pos) return pos;
        }
        return sensor.node.getWorldPosition(new THREE.Vector3());
    }

    /**
     * Compute sensor world normal by transforming the local normal through the node's world rotation.
     * @private
     */
    _getSensorWorldNormal(sensor) {
        const worldQuat = new THREE.Quaternion();
        sensor.node.getWorldQuaternion(worldQuat);
        return sensor.normalLocal.clone().applyQuaternion(worldQuat).normalize();
    }

    /**
     * Compute contact force between a sensor disc and a spherical object.
     * Force is proportional to penetration depth along the sensor normal.
     *
     * @param {THREE.Vector3} sensorPos - Sensor center in world space
     * @param {THREE.Vector3} sensorNormal - Outward-facing sensor normal
     * @param {number} sensorRadius - Sensor disc radius
     * @param {THREE.Vector3} objPos - Object center in world space
     * @param {number} objRadius - Object bounding sphere radius
     * @returns {number} Force value 0–1023
     * @private
     */
    _computeContactForce(sensorPos, sensorNormal, sensorRadius, objPos, objRadius) {
        // Vector from sensor center to object center
        const toObj = objPos.clone().sub(sensorPos);

        // Distance along sensor normal (positive = object is in front of sensor)
        const normalDist = toObj.dot(sensorNormal);

        // Lateral distance (perpendicular to normal)
        const lateralVec = toObj.clone().sub(sensorNormal.clone().multiplyScalar(normalDist));
        const lateralDist = lateralVec.length();

        // Check if object is within the sensor's lateral reach
        const combinedLateralRadius = sensorRadius + objRadius;
        if (lateralDist > combinedLateralRadius) return 0;

        // Check if object surfaces overlap along the normal direction
        // The sensor is a flat disc, so contact happens when normalDist < objRadius
        // and normalDist > -objRadius (object is near the sensor plane)
        const penetration = objRadius - normalDist;
        if (penetration <= 0) return 0;

        // Clamp penetration to a reasonable range (0 to 2*objRadius)
        const maxPenetration = objRadius * 2;
        const normalizedForce = Math.min(penetration / maxPenetration, 1.0);

        // Scale lateral proximity factor (full force at center, less at edges)
        const lateralFactor = Math.max(0, 1 - lateralDist / combinedLateralRadius);

        return Math.round(normalizedForce * lateralFactor * TouchSensorManager.MAX_FORCE);
    }

    /**
     * Remove visualization and reset state.
     * @param {THREE.Scene} scene
     */
    cleanup(scene) {
        if (this.visualization && scene) {
            scene.remove(this.visualization);
            this.visualization.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            this.visualization = null;
        }
        this.sensors = [];
    }
}

export default TouchSensorManager;
