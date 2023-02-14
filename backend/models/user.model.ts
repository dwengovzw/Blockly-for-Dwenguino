import mongoose from "mongoose"
import db from "../config/db.config.js"
//import { isEmail } from 'validator/es/index.js'
import { IRole, RoleSchema } from './role.model.js'
import { ISavedEnvironmentState, SavedEnvironmentStateSchema } from "./saved_evnironment_state.model.js"
import  v4 from "uuid/v4.js"


interface IUserShared {
    uuid?: string,
    userId: string,
    platform: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    emailConfirmed?: boolean,
    emailConfirmationCode?: string,
    savedEnvironmentState?: ISavedEnvironmentState,
    birthdate?: Date,
}

// only for data associated with the user that is only used in the frontend: nothing for now..
interface IUserFrontend extends IUserShared {

}

interface IUser extends IUserShared {
    roles?: IRole[]
}

interface IUserDoc extends IUser, Document {

}

const UserSchemaFields: Record<keyof IUser, any> = 
{
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    userId:{
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
        trim: true, 
        enum: Object.values(db.PLATFORMS)
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        //validate: [isEmail, ""]
    },
    emailConfirmed: Boolean,
    emailConfirmationCode: String,
    savedEnvironmentState: SavedEnvironmentStateSchema,
    birthdate: Date,
    roles: [{
            type: RoleSchema
        }
    ]
}
const UserSchema = new mongoose.Schema<IUser>(UserSchemaFields)
const User = mongoose.model<IUser>('User', UserSchema)


// This is needed because for mongoose a discriminator type only contains new fields.
// These the fields of the base type are automatically added to the subtype.
// Since we want the IStudent interface to have all fields it combines the fields of
// the super type (IUser) and the IStudentExtraFields type.
interface IStudentExtraFields {
    schoolId?: String,
    grade?: String,
}
interface IStudent extends IUser, IStudentExtraFields {}
const StudentSchemaFields: Record<keyof IStudentExtraFields, any> = 
{
    schoolId: String,
    grade: String
}
const StudentSchema = new mongoose.Schema<IStudent>(StudentSchemaFields)
interface IStudentModel extends mongoose.Model<IStudent> {}
const Student = User.discriminator<IStudent, IStudentModel>('Student', StudentSchema)


interface ITeacherExtraFields {
// Empty for now, add fields if needed
}
interface ITeacher extends IUser, ITeacherExtraFields {}
const TeacherSchemaFields: Record<keyof ITeacherExtraFields, any> = 
{
}
const TeacherSchema = new mongoose.Schema<ITeacher>(TeacherSchemaFields)
interface ITeacherModel extends mongoose.Model<ITeacher> {}
const Teacher = User.discriminator<ITeacher, ITeacherModel>('Teacher', TeacherSchema)

export { User, Teacher, Student, IUser, IUserFrontend, IUserShared, ITeacher, IStudent } 