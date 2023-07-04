const PLATFORMS = {
    github: "github",
    leerId: "leerId",
    beACM: "beACM",
    test: ""
}

// only support test platform in dev mode
if (process.env.NODE_ENV == "debug"){
    PLATFORMS["test"] = "test"
}

export const ROLES = {
    user: "user",
    student: "student", 
    teacher: "teacher", 
    admin: "admin",
};


const db = {
    PLATFORMS: PLATFORMS,
    ROLES: ROLES,
}

export default db