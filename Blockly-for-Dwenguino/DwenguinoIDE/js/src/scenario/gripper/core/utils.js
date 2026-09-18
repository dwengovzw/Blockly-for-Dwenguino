import * as THREE from "three";

/**
 * Apply a world-space transform to a node, converting to local space if needed.
 * @param {THREE.Object3D} node
 * @param {THREE.Vector3} targetWorldPos
 * @param {THREE.Quaternion} targetWorldQuat
 */
export function applyWorldTransform(node, targetWorldPos, targetWorldQuat) {
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

/**
 * Clamp a vector to a maximum length.
 * Prevents constraint iterations from exploding.
 * @param {THREE.Vector3} vec
 * @param {number} maxLength - Maximum length (0 or negative means no clamping)
 * @returns {THREE.Vector3} The clamped vector (mutated in place)
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
 * Create a virtual reference entity with a given world-space plane normal and point.
 * Used to build composite constraints from primitives.
 * @param {THREE.Vector3} normal - Desired plane normal in world space (uses local +Z).
 * @param {THREE.Vector3} point - Desired plane point in world space.
 * @param {string} name - Optional name for the virtual entity.
 * @returns {{name: string, node: THREE.Object3D}}
 */
export function createVirtualPlaneEntity(normal, point, name = '__virtual_plane__') {
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
 * Resolve a constraint's reference point to world coordinates.
 * Falls back to entity node position if no reference point is defined.
 * @param {Object} constraint - The constraint object
 * @param {number} index - Entity index
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @returns {THREE.Vector3} World position
 */
export function resolveConstraintPoint(constraint, index, refGeometry) {
    const ref = constraint.referencePoints?.[index];
    if (ref) {
        const refName = typeof ref === 'string' ? ref : ref.name;
        const refEntityName = typeof ref === 'string'
            ? constraint.entities[index].name
            : (ref.entityName ?? constraint.entities[index].name);
        const point = refGeometry.getReferencePointWorldPosition(refEntityName, refName);
        if (point) return point;
    }
    return constraint.entities[index].node.getWorldPosition(new THREE.Vector3());
}

/**
 * Resolve a constraint's reference plane to world coordinates.
 * Falls back to entity node's local +Z axis if no reference plane is defined.
 * @param {Object} constraint - The constraint object
 * @param {number} index - Entity index
 * @param {ReferenceGeometry} refGeometry - Reference geometry resolver
 * @returns {{normal: THREE.Vector3, point: THREE.Vector3}} World-space plane
 */
export function resolveConstraintPlane(constraint, index, refGeometry) {
    const ref = constraint.referencePlanes?.[index];
    if (ref) {
        const refName = typeof ref === 'string' ? ref : ref.name;
        const plane = refGeometry.getReferencePlaneWorld(constraint.entities[index].name, refName);
        if (plane) return plane;
    }

    const node = constraint.entities[index].node;
    const q = node.getWorldQuaternion(new THREE.Quaternion());
    return {
        normal: new THREE.Vector3(0, 0, 1).applyQuaternion(q).normalize(),
        point: node.getWorldPosition(new THREE.Vector3())
    };
}
