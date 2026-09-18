import * as THREE from "three";

/**
 * Represents a simple graspable object in the gripper simulation.
 * The object falls under gravity and can be held by opposing touch sensors.
 *
 * Physics are kept intentionally simple:
 * - Gravity pulls the object downward each frame
 * - If two or more touch sensors are in contact (opposing forces),
 *   the object is considered "gripped" and gravity is cancelled
 * - The object rests on the floor plane (Y = 0)
 */
class GraspableObject {
    /** @type {THREE.Mesh|null} */
    mesh = null;

    /** @type {THREE.Scene|null} */
    scene = null;

    /** @type {string} Shape type: "sphere", "box", "cylinder" */
    shape = "sphere";

    /** @type {number} Size in world units (radius for sphere, half-extent for box) */
    size = 0.015;

    /** @type {THREE.Vector3} Current velocity */
    velocity = new THREE.Vector3();

    /** @type {number} Gravity acceleration (m/s² scaled to scene units) */
    gravity = -0.5;

    /** @type {boolean} Whether the object is currently gripped */
    gripped = false;

    /** @type {boolean} Whether the object is visible/active */
    _visible = false;

    /** @type {number} Floor Y position */
    floorY = 0;

    /** @type {THREE.Vector3} Initial spawn position */
    spawnPosition = new THREE.Vector3(0, 0.1, 0);

    /**
     * Create the object mesh and add it to the scene.
     *
     * @param {THREE.Scene} scene
     * @param {Object} [options]
     * @param {string} [options.shape="sphere"]
     * @param {number} [options.size=0.015]
     * @param {THREE.Vector3} [options.spawnPosition]
     */
    initialize(scene, options = {}) {
        this.cleanup();
        this.scene = scene;
        this.shape = options.shape || "sphere";
        this.size = options.size || 0.015;
        if (options.spawnPosition) {
            this.spawnPosition.copy(options.spawnPosition);
        }

        const material = new THREE.MeshStandardMaterial({
            color: 0xe07020,
            roughness: 0.6,
            metalness: 0.1
        });

        let geometry;
        switch (this.shape) {
            case "box":
                geometry = new THREE.BoxGeometry(
                    this.size * 2, this.size * 2, this.size * 2
                );
                break;
            case "cylinder":
                geometry = new THREE.CylinderGeometry(
                    this.size, this.size, this.size * 2, 16
                );
                break;
            case "sphere":
            default:
                geometry = new THREE.SphereGeometry(this.size, 16, 12);
                break;
        }

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = "__graspable_object__";
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.copy(this.spawnPosition);
        this.mesh.visible = false;

        scene.add(this.mesh);
        this._visible = false;
        this.velocity.set(0, 0, 0);
        this.gripped = false;
    }

    /**
     * Show or hide the graspable object.
     * @param {boolean} visible
     */
    setVisible(visible) {
        this._visible = visible;
        if (this.mesh) {
            this.mesh.visible = visible;
        }
        if (visible) {
            this.resetPosition();
        }
    }

    /**
     * @returns {boolean} Whether the object is active/visible.
     */
    isVisible() {
        return this._visible && this.mesh?.visible;
    }

    /**
     * Reset to spawn position and clear velocity.
     */
    resetPosition() {
        if (this.mesh) {
            this.mesh.position.copy(this.spawnPosition);
        }
        this.velocity.set(0, 0, 0);
        this.gripped = false;
    }

    /**
     * Get the object's current world position.
     * @returns {THREE.Vector3|null}
     */
    getWorldPosition() {
        if (!this.mesh) return null;
        return this.mesh.position.clone();
    }

    /**
     * Get the bounding sphere radius for collision detection.
     * @returns {number}
     */
    getBoundingRadius() {
        return this.size;
    }

    /**
     * Update the graspable object physics.
     * - Apply gravity if not gripped
     * - Check grip state from touch sensor contacts
     * - Floor collision
     *
     * @param {number} dt - Delta time in seconds
     * @param {Array<{position: THREE.Vector3, normal: THREE.Vector3, radius: number, force: number}>} contacts
     *   Active contact points from TouchSensorManager.getContactInfo()
     */
    update(dt, contacts) {
        if (!this.mesh || !this._visible) return;

        // Determine grip state: need at least 2 contacts with opposing normals
        this.gripped = this._checkGrip(contacts);

        if (this.gripped) {
            // Move object to centroid of contact points
            this.velocity.set(0, 0, 0);
            if (contacts.length >= 2) {
                const centroid = new THREE.Vector3();
                for (const c of contacts) {
                    centroid.add(c.position);
                }
                centroid.divideScalar(contacts.length);
                // Smoothly move toward centroid
                this.mesh.position.lerp(centroid, 0.3);
            }
        } else {
            // Apply gravity
            this.velocity.y += this.gravity * dt;
            this.mesh.position.addScaledVector(this.velocity, dt);

            // Floor collision
            const minY = this.floorY + this.size;
            if (this.mesh.position.y < minY) {
                this.mesh.position.y = minY;
                this.velocity.y = 0;
            }
        }
    }

    /**
     * Check if the object is gripped by opposing sensor contacts.
     * Two contacts are "opposing" if their normals point roughly toward each other
     * (dot product < -0.3).
     *
     * @param {Array<{position: THREE.Vector3, normal: THREE.Vector3, force: number}>} contacts
     * @returns {boolean}
     * @private
     */
    _checkGrip(contacts) {
        if (!contacts || contacts.length < 2) return false;
        for (let i = 0; i < contacts.length; i++) {
            for (let j = i + 1; j < contacts.length; j++) {
                const dot = contacts[i].normal.dot(contacts[j].normal);
                if (dot < -0.3) return true;
            }
        }
        return false;
    }

    /**
     * Update the object's shape and size.
     *
     * @param {string} shape
     * @param {number} size
     */
    setShape(shape, size) {
        if (!this.mesh || !this.scene) return;
        const wasVisible = this._visible;
        const pos = this.mesh.position.clone();
        this.initialize(this.scene, {
            shape,
            size,
            spawnPosition: this.spawnPosition
        });
        this.mesh.position.copy(pos);
        if (wasVisible) {
            this.setVisible(true);
        }
    }

    /**
     * Set the spawn position for the object.
     * @param {THREE.Vector3} position
     */
    setSpawnPosition(position) {
        this.spawnPosition.copy(position);
    }

    /**
     * Remove mesh from scene and dispose resources.
     */
    cleanup() {
        if (this.mesh && this.scene) {
            this.scene.remove(this.mesh);
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
            this.mesh = null;
        }
        this._visible = false;
        this.gripped = false;
        this.velocity.set(0, 0, 0);
    }
}

export default GraspableObject;
