let PLATFORMS = {
    "github": "github",
    "leerId": "leerId",
    "beACM": "beACM",
}

// only support test platform in dev mode
if (process.env.NODE_ENV == "development"){
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