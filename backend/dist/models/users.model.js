import mongoose from "mongoose";
import db from "../config/db.config.js";
import isEmail from 'validator/es/lib/isEmail.js';
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
        validate: [isEmail, ""]
    },
    savedEnvironmentState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedState"
    },
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
    ...UserSchemaFields,
    schoolId: String,
    grade: String
};
const StudentSchema = new mongoose.Schema(StudentSchemaFields);
const Student = User.discriminator('Student', StudentSchema);
const TeacherSchemaFields = {
    ...UserSchemaFields
};
const TeacherSchema = new mongoose.Schema(TeacherSchemaFields);
const Teacher = User.discriminator('Teacher', TeacherSchema);
//# sourceMappingURL=users.model.js.map