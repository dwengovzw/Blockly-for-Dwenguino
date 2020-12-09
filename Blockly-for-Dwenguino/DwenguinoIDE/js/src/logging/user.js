class User {
    username = null;
    password = null;

    constructor(username, password) {
        this.username = username;
        this.password = password.slice();
        Object.freeze(this.password);
    }
};

export default User;