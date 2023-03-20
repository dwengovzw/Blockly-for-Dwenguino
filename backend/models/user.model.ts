import mongoose from "mongoose"
import { Document, Schema, model } from "mongoose"
import db from "../config/db.config.js"
//import { isEmail } from 'validator/es/index.js'
import { IRole, RoleSchema } from './role.model.js'
import { ISavedEnvironmentState, SavedEnvironmentStateSchema } from "./saved_evnironment_state.model.js"
import  v4 from "uuid/v4.js"
import { IPortfolio } from "./portfolio.model.js"


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
    portfolios?: IPortfolio[],
    birthdate?: Date,
    schoolId?: String,
    grade?: String,
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
    portfolios: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Portfolio', 
            required: true, 
            default: []
        }
    ],
    birthdate: Date,
    roles: [{
            type: RoleSchema
        }
    ],
    schoolId: String,
    grade: String
}
const UserSchema = new mongoose.Schema<IUser>(UserSchemaFields)
const User = mongoose.model<IUser>('User', UserSchema)



export { User, IUser, IUserFrontend, IUserShared, IUserDoc} 