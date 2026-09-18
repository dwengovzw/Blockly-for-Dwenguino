import * as THREE from "three";

/**
 * Manages reference geometry (points and planes) defined per-part in a kinematics descriptor.
 * Points and planes are stored in local coordinates relative to each part node,
 * and are resolved to world coordinates on demand with caching.
 */
class ReferenceGeometry {
    /** @type {Map<string, Object>} Cache of part definitions indexed by name */
    partsCache = new Map();
    /** @type {Map<string, THREE.Vector3>} Cache of world-space reference points, keyed as "partName:pointName" */
    referencePointsCache = new Map();
    /** @type {number} Scale factor for reference point coordinates */
    referencePointScale = 1.0;
    /** @type {boolean} Whether to show reference point visualization */
    showReferencePoints = false;
    /** @type {THREE.Group|null} Visualization group for debug spheres/labels */
    referencePointVisualization = null;
    /** @type {THREE.Object3D|null} Root node of the loaded 3D model */
    modelRoot = null;

    /**
     * Set the model root used for node lookups.
     * @param {THREE.Object3D} modelRoot
     */
    setModelRoot(modelRoot) {
        this.modelRoot = modelRoot;
    }

    /**
     * Set the scale factor for reference point coordinates.
     * @param {number} scale
     */
    setReferencePointScale(scale) {
        this.referencePointScale = scale;
    }

    /**
     * Build the parts cache from a kinematics descriptor.
     * @param {Object} descriptor - Kinematics descriptor with parts array
     */
    buildPartsCache(descriptor) {
        this.partsCache.clear();
        this.referencePointsCache.clear();
        if (descriptor?.parts) {
            for (let partDef of descriptor.parts) {
                this.partsCache.set(partDef.name, partDef);
            }
        }
    }

    /**
     * Get a part definition by name.
     * @param {string} partName
     * @returns {Object|null}
     */
    getPartDefinition(partName) {
        return this.partsCache.get(partName) || null;
    }

    /**
     * Resolve a reference point to world coordinates.
     * Reference points are stored in local coordinates (relative to part node).
     * @param {string} partName - Name of the part (GLB node name)
     * @param {string} pointName - Name of the reference point
     * @returns {THREE.Vector3|null} World position, or null if not found
     */
    getReferencePointWorldPosition(partName, pointName) {
        const cacheKey = `${partName}:${pointName}`;
        if (this.referencePointsCache.has(cacheKey)) {
            return this.referencePointsCache.get(cacheKey).clone();
        }

        const partNode = this.modelRoot?.getObjectByName(partName);
        if (!partNode) {
            console.warn(`[ReferenceGeometry] Part node not found: ${partName}`);
            return null;
        }

        const partDef = this.getPartDefinition(partName);
        if (!partDef || !partDef.referencePoints || !partDef.referencePoints[pointName]) {
            console.warn(`[ReferenceGeometry] Reference point not found: ${partName}.${pointName}`);
            return null;
        }

        const localPoint = partDef.referencePoints[pointName];
        const worldPos = new THREE.Vector3(
            (localPoint.x || 0) * this.referencePointScale,
            (localPoint.y || 0) * this.referencePointScale,
            (localPoint.z || 0) * this.referencePointScale
        );

        worldPos.applyMatrix4(partNode.matrixWorld);

        this.referencePointsCache.set(cacheKey, worldPos.clone());
        return worldPos;
    }

    /**
     * Resolve a reference plane to world coordinates.
     * @param {string} partName - Name of the part (GLB node name)
     * @param {string} planeName - Name of the reference plane
     * @returns {{normal: THREE.Vector3, point: THREE.Vector3}|null} World-space plane, or null if not found
     */
    getReferencePlaneWorld(partName, planeName) {
        const partNode = this.modelRoot?.getObjectByName(partName);
        if (!partNode) {
            console.warn(`[ReferenceGeometry] Part node not found: ${partName}`);
            return null;
        }

        const partDef = this.getPartDefinition(partName);
        if (!partDef || !partDef.referencePlanes || !partDef.referencePlanes[planeName]) {
            console.warn(`[ReferenceGeometry] Reference plane not found: ${partName}.${planeName}`);
            return null;
        }

        const planeDef = partDef.referencePlanes[planeName];

        const worldNormal = new THREE.Vector3(
            planeDef.normal[0] || 0,
            planeDef.normal[1] || 0,
            planeDef.normal[2] || 0
        );
        worldNormal.applyMatrix4(partNode.matrixWorld);
        worldNormal.sub(partNode.position);
        worldNormal.normalize();

        const worldPoint = new THREE.Vector3(
            planeDef.point[0] || 0,
            planeDef.point[1] || 0,
            planeDef.point[2] || 0
        );
        worldPoint.applyMatrix4(partNode.matrixWorld);

        return { normal: worldNormal, point: worldPoint };
    }

    /**
     * Invalidate the reference points cache.
     * Called when a part moves and reference points need to be recalculated.
     * @param {string|null} partName - Part name, or null to clear entire cache
     */
    invalidateCache(partName) {
        if (!partName) {
            this.referencePointsCache.clear();
            return;
        }
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
     * @param {THREE.Scene} scene - The Three.js scene to add visualization to
     * @param {Object} descriptor - Kinematics descriptor with parts
     */
    visualizeReferencePoints(scene, descriptor) {
        this.hideReferencePoints(scene);

        this.referencePointVisualization = new THREE.Group();
        this.referencePointVisualization.name = "referencePointVisualization";

        if (!descriptor?.parts) return;

        for (const partDef of descriptor.parts) {
            const partNode = this.modelRoot?.getObjectByName(partDef.name);
            if (!partNode || !partDef.referencePoints) continue;

            for (const [pointName] of Object.entries(partDef.referencePoints)) {
                const worldPos = this.getReferencePointWorldPosition(partDef.name, pointName);
                if (!worldPos) continue;

                const sphereRadius = 2 * this.referencePointScale;
                const labelWidth = 20 * this.referencePointScale;
                const labelHeight = 6 * this.referencePointScale;
                const labelFontSize = Math.max(16, 40 * this.referencePointScale);

                const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
                const material = new THREE.MeshStandardMaterial({
                    color: 0xFF6B6B,
                    emissive: 0xFF6B6B,
                    metalness: 0.3,
                    roughness: 0.4
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(worldPos);
                this.referencePointVisualization.add(sphere);

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
                label.position.z += 5 * this.referencePointScale;
                this.referencePointVisualization.add(label);

                console.log(`[Visualization] Reference point: ${partDef.name}.${pointName} at (${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)})`);
            }
        }

        scene.add(this.referencePointVisualization);
        console.log(`[Visualization] Visualized ${this.referencePointVisualization.children.length / 2} reference points`);
    }

    /**
     * Hide the reference point visualization.
     * @param {THREE.Scene} scene - The Three.js scene
     */
    hideReferencePoints(scene) {
        if (this.referencePointVisualization) {
            scene.remove(this.referencePointVisualization);
            this.referencePointVisualization = null;
        }
    }
}

export default ReferenceGeometry;
