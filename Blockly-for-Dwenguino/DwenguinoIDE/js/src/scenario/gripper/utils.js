import * as THREE from "three";

/**
 * Clamp a vector to a maximum length.
 * If the vector length exceeds maxLength, scale it down.
 * If maxLength <= 0, return the vector unchanged.
 * 
 * @param {THREE.Vector3} vec - The vector to clamp
 * @param {number} maxLength - Maximum allowed length (0 or negative = no limit)
 * @returns {THREE.Vector3} The clamped vector
 */
export function clampStep(vec, maxLength) {
    if (!maxLength || maxLength <= 0) return vec;
    const len = vec.length();
    if (len > maxLength) {
        vec.multiplyScalar(maxLength / len);
    }
    return vec;
}

/**
 * Resolve a constraint point to world coordinates.
 * Priority: reference point > datum > entity origin
 * 
 * @param {Object} constraint - Constraint definition
 * @param {number} entityIndex - Index of the entity in constraint.entities
 * @param {Object} refGeometry - ReferenceGeometry instance
 * @param {THREE.Object3D} modelRoot - Root of the 3D model for fallback
 * @returns {THREE.Vector3|null} World position of the point
 */
export function resolveConstraintPoint(constraint, entityIndex, refGeometry, modelRoot) {
    if (!constraint || entityIndex < 0 || entityIndex >= constraint.entities.length) {
        return null;
    }

    const entity = constraint.entities[entityIndex];
    const entityName = typeof entity === "string" ? entity : entity.name;

    // Try reference point first
    if (constraint.referencePoints && constraint.referencePoints[entityIndex]) {
        const refPointDef = constraint.referencePoints[entityIndex];
        const refPointName = typeof refPointDef === "string" ? refPointDef : refPointDef?.name;
        const refEntityName = typeof refPointDef === "object"
            ? (refPointDef?.entityName ?? entityName)
            : entityName;
        const worldPos = refPointName
            ? refGeometry.getReferencePointWorldPosition(refEntityName, refPointName)
            : null;
        if (worldPos) return worldPos;
    }

    // Try datum node (legacy)
    if (constraint.datums && constraint.datums[entityIndex]) {
        const datumNode = constraint.datums[entityIndex];
        if (datumNode && datumNode.node) {
            return datumNode.node.getWorldPosition(new THREE.Vector3());
        }
    }

    // Fallback to entity node origin
    if (entity && typeof entity === "object" && entity.node) {
        return entity.node.getWorldPosition(new THREE.Vector3());
    }

    if (modelRoot) {
        const entityNode = modelRoot.getObjectByName(entityName);
        if (entityNode) {
            return entityNode.getWorldPosition(new THREE.Vector3());
        }
    }

    return null;
}

/**
 * Resolve a constraint plane to world coordinates.
 * Priority: reference plane > datum > entity's local +Z plane
 * 
 * @param {Object} constraint - Constraint definition
 * @param {number} entityIndex - Index of the entity in constraint.entities
 * @param {Object} refGeometry - ReferenceGeometry instance
 * @param {THREE.Object3D} modelRoot - Root of the 3D model for fallback
 * @returns {Object|null} Plane with {normal: Vector3, point: Vector3} in world coords
 */
export function resolveConstraintPlane(constraint, entityIndex, refGeometry, modelRoot) {
    if (!constraint || entityIndex < 0 || entityIndex >= constraint.entities.length) {
        return null;
    }

    const entity = constraint.entities[entityIndex];
    const entityName = typeof entity === "string" ? entity : entity.name;

    // Try reference plane first
    if (constraint.referencePlanes && constraint.referencePlanes[entityIndex]) {
        const refPlaneDef = constraint.referencePlanes[entityIndex];
        const refPlaneName = typeof refPlaneDef === "string" ? refPlaneDef : refPlaneDef?.name;
        const refEntityName = typeof refPlaneDef === "object"
            ? (refPlaneDef?.entityName ?? entityName)
            : entityName;
        const worldPlane = refPlaneName
            ? refGeometry.getReferencePlaneWorld(refEntityName, refPlaneName)
            : null;
        if (worldPlane) return worldPlane;
    }

    // Try datum (not typically used for planes, but support it)
    if (constraint.datums && constraint.datums[entityIndex]) {
        const datumNode = constraint.datums[entityIndex];
        if (datumNode && datumNode.node) {
            const datumQuat = new THREE.Quaternion();
            datumNode.node.getWorldQuaternion(datumQuat);
            return {
                normal: new THREE.Vector3(0, 0, 1).applyQuaternion(datumQuat).normalize(),
                point: datumNode.node.getWorldPosition(new THREE.Vector3())
            };
        }
    }

    // Fallback to entity node's local +Z plane
    if (entity && typeof entity === "object" && entity.node) {
        const nodeQuat = new THREE.Quaternion();
        entity.node.getWorldQuaternion(nodeQuat);
        return {
            normal: new THREE.Vector3(0, 0, 1).applyQuaternion(nodeQuat).normalize(),
            point: entity.node.getWorldPosition(new THREE.Vector3())
        };
    }

    if (modelRoot) {
        const entityNode = modelRoot.getObjectByName(entityName);
        if (entityNode) {
            const nodeQuat = new THREE.Quaternion();
            entityNode.getWorldQuaternion(nodeQuat);
            return {
                normal: new THREE.Vector3(0, 0, 1).applyQuaternion(nodeQuat).normalize(),
                point: entityNode.getWorldPosition(new THREE.Vector3())
            };
        }
    }

    return null;
}

/**
 * Create a virtual reference entity with a given world-space plane.
 * Used to build composite constraints from primitives (e.g., Horizontal constraint).
 * 
 * @param {THREE.Vector3} normal - Desired plane normal in world space
 * @param {THREE.Vector3} point - Desired plane point in world space
 * @param {string} [name="__virtual_plane__"] - Optional name for the virtual entity
 * @returns {Object} {name, node} where node is a THREE.Object3D
 */
export function createVirtualPlaneEntity(normal, point, name = "__virtual_plane__") {
    const node = new THREE.Object3D();
    
    // Normalize the normal
    const targetNormal = normal ? normal.clone().normalize() : new THREE.Vector3(0, 0, 1);
    
    // Create rotation that aligns local +Z with the target normal
    const rotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        targetNormal
    );
    
    node.quaternion.copy(rotation);
    node.position.copy(point ?? new THREE.Vector3());
    
    return { name, node };
}

export default {
    clampStep,
    resolveConstraintPoint,
    resolveConstraintPlane,
    createVirtualPlaneEntity
};
