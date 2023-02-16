class MinimalUserInfo {
    userId: string;
    platform: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: string[] = [];

    constructor(userId:string, platform:string, firstname:string, lastname: string, email:string, roles:string[]){
        this.userId = userId;
        this.platform = platform;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.roles = roles;
    }

    getUserId(){
        return this.userId;
    }

    getPlatform(){
        return this.platform;
    }

    getFirstName(){
        return this.firstname;
    }

    getLastName(){
        return this.lastname;
    }

    getEmail(){
        return this.email;
    }

    getRoles(){
        return this.roles;
    }
}

export default MinimalUserInfo