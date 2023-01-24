class MinimalUserInfo {
    userId;
    platform;
    name;
    email;
    roles = [];
    constructor(userId, platform, name, email, role) {
        this.userId = userId;
        this.platform = platform;
        this.name = name;
        this.email = email;
        this.roles.push(role);
    }
    getUserId() {
        return this.userId;
    }
    getPlatform() {
        return this.platform;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getRoles() {
        return this.roles;
    }
}
export default MinimalUserInfo;
//# sourceMappingURL=minimalUserInfo.js.map