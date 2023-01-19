const PLATFORMS = {
    github: "github",
    leerId: "leerId",
    beACM: "beACM"
}

const ROLES = {
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