import mongoose from "mongoose"
import { PopulatedDoc } from 'mongoose';
import { Document, Schema, model } from "mongoose"
import db from "../config/db.config"
import { IRole, RoleSchema } from './role.model'
import  v4 from "uuid/v4"
import { IPortfolio } from "./portfolio.model"


interface IUserShared {
    uuid?: string,
    userId: string,
    platform: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    emailConfirmed?: boolean,
    emailConfirmationCode?: string,
    portfolios: PopulatedDoc<IPortfolio>[] | IPortfolio[],
    birthdate?: Date,
    schoolId?: String,
    grade?: String,
    acceptedTerms?: boolean,
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
    grade: String,
    acceptedTerms: {
        type: Boolean,
        required: true,
        default: false
    }
}
const UserSchema = new mongoose.Schema<IUser>(UserSchemaFields)
const User = mongoose.model<IUser>('User', UserSchema)



export { User, IUser, IUserFrontend, IUserShared, IUserDoc} 