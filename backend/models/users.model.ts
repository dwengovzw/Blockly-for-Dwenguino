import mongoose from "mongoose"
import db from "../config/db.config.js"
//import isEmail from 'validator/es/lib/isEmail.js';
import { IRoleDoc } from './role.model.js'
import { ID } from "./modelutils.js"
import { ISavedEnvironmentState, SavedEnvironmentStateSchema } from "./saved_evnironment_state.model.js"


interface IUserShared {
    userId: string,
    platform: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    savedEnvironmentState?: ISavedEnvironmentState,
    birthdate?: Date,
}

// only for data associated with the user that is only used in the frontend: nothing for now..
interface IUserFrontend extends IUserShared {

}

interface IUser extends IUserShared {
    roles?: ID[] | IRoleDoc[]
}

interface IUserDoc extends IUser , mongoose.Document {}

const UserSchemaFields: Record<keyof IUser, any> = 
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
}
const UserSchema = new mongoose.Schema(UserSchemaFields)
const User = mongoose.model<IUserDoc>('User', UserSchema)


// This is needed because for mongoose a discriminator type only contains new fields.
// These the fields of the base type are automatically added to the subtype.
// Since we want the IStudent interface to have all fields it combines the fields of
// the super type (IUser) and the IStudentExtraFields type.
interface IStudentExtraFields {
    schoolId?: String,
    grade?: String,
}
interface IStudent extends IUser, IStudentExtraFields {}
interface IStudentDoc extends IStudent, mongoose.Document {}
const StudentSchemaFields: Record<keyof IStudentExtraFields, any> = 
{
    schoolId: String,
    grade: String
}
const StudentSchema = new mongoose.Schema(StudentSchemaFields)
interface IStudentModel extends mongoose.Model<IStudentDoc> {}
const Student = User.discriminator<IStudentDoc, IStudentModel>('Student', StudentSchema)


interface ITeacherExtraFields {
// Empty for now, add fields if needed
}
interface ITeacher extends IUser, ITeacherExtraFields {}
interface ITeacherDoc extends ITeacher, mongoose.Document {}
const TeacherSchemaFields: Record<keyof ITeacherExtraFields, any> = 
{
}
const TeacherSchema = new mongoose.Schema(TeacherSchemaFields)
interface ITeacherModel extends mongoose.Model<ITeacherDoc> {}
const Teacher = User.discriminator<ITeacherDoc, ITeacherModel>('Teacher', TeacherSchema)

export { User, Teacher, Student, IUser, IUserFrontend, IUserShared, ITeacher, IStudent, IUserDoc, IStudentDoc, ITeacherDoc } 