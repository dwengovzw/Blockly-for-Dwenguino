import mongoose from "mongoose";
import db from "../config/db.config.js";
import { SavedEnvironmentStateSchema } from "./saved_evnironment_state.model.js";
const UserSchemaFields = {
    userId: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
        enum: Object.values(db.PLATFORMS)
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        //validate: [isEmail, ""]
    },
    savedEnvironmentState: SavedEnvironmentStateSchema,
    birthdate: Date,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
};
const UserSchema = new mongoose.Schema(UserSchemaFields);
const User = mongoose.model('User', UserSchema);
const StudentSchemaFields = {
    schoolId: String,
    grade: String
};
const StudentSchema = new mongoose.Schema(StudentSchemaFields);
const Student = User.discriminator('Student', StudentSchema);
const TeacherSchemaFields = {};
const TeacherSchema = new mongoose.Schema(TeacherSchemaFields);
const Teacher = User.discriminator('Teacher', TeacherSchema);
export { User, Teacher, Student };
//# sourceMappingURL=users.model.js.map