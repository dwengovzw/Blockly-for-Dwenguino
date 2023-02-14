class MinimalUserInfo {
    userId: string;
    platform: string;
    name: string;
    email: string;
    roles: string[] = [];

    constructor(userId:string, platform:string, name:string, email:string, roles:string[]){
        this.userId = userId;
        this.platform = platform;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    getUserId(){
        return this.userId;
    }

    getPlatform(){
        return this.platform;
    }

    getName(){
        return this.name;
    }

    getEmail(){
        return this.email;
    }

    getRoles(){
        return this.roles;
    }
}

export default MinimalUserInfo