import mongoose from "mongoose"
import db from "../config/db.config.js"
import isEmail from 'validator/es/lib/isEmail.js';




interface IUserShared {
    userId: string,
    platform: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    savedEnvironmentState?: mongoose.Types.ObjectId,
    birthdate?: Date,
}

// only for data associated with the user that is only used in the frontend: nothing for now..
interface IUserFrontend extends IUserShared {

}

interface IUserBackend extends IUserShared {
    roles?: mongoose.Types.ObjectId[]
}

interface IUserDoc extends IUserBackend, mongoose.Document {}

const UserSchemaFields: Record<keyof IUserBackend, any> = 
{
    userId:{
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
}
const UserSchema = new mongoose.Schema(UserSchemaFields)
const User = mongoose.model<IUserDoc>('User', UserSchema)




interface IStudent extends IUserBackend {
    schoolId?: String,
    grade?: String,
}
interface IStudentDoc extends IStudent, mongoose.Document {}
const StudentSchemaFields: Record<keyof IStudent, any> = 
{
    ...UserSchemaFields,
    schoolId: String,
    grade: String
}
const StudentSchema = new mongoose.Schema(StudentSchemaFields)
interface IStudentModel extends mongoose.Model<IStudentDoc> {}
const Student = User.discriminator<IStudentDoc, IStudentModel>('Student', StudentSchema)



interface ITeacher extends IUserBackend {
    // Empty for now, add fields if needed
}
interface ITeacherDoc extends ITeacher, mongoose.Document {}
const TeacherSchemaFields: Record<keyof ITeacher, any> = 
{
    ...UserSchemaFields
}
const TeacherSchema = new mongoose.Schema(TeacherSchemaFields)
interface ITeacherModel extends mongoose.Model<ITeacherDoc> {}
const Teacher = User.discriminator<ITeacherDoc, ITeacherModel>('Teacher', TeacherSchema)

export { User, Teacher, Student, IUserBackend, IUserFrontend, IUserShared, ITeacher, IStudent, IUserDoc, IStudentDoc, ITeacherDoc }