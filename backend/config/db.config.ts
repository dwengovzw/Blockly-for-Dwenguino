const PLATFORMS = {
    github: "github",
    leerId: "leerId",
    beACM: "beACM",
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

type dbSettings = {
    [key: string]: any;
}
const db:dbSettings = {}
db.PLATFORMS = PLATFORMS;
db.ROLES = ROLES;

export default db