function BindMethods(targetObject) {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(targetObject));
    methods
        .filter(method => (method !== 'constructor'))
        .forEach(method => {targetObject[method] = targetObject[method].bind(targetObject)});
    return targetObject
}

export default BindMethods;