import mongoose, { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IStudent, ITeacher, IUser } from "./user.model.js"
import  v4 from "uuid/v4.js"

interface IClassGroup {
    uuid?: string,
    name: string,
    sharingCode?: string,
    description?: string,
    ownedBy: ID[] | IUser[],
    awaitingStudents: ID[] | IUser[],
    students: ID[] | IUser[]
}
const ClassGroupFields: Record<keyof IClassGroup, any> = {
    uuid: {      // UUID (different from the automatically generated _id)
        type: String,
        required: true,
        default: v4, // Use automatically generated uuid as identifier (unique in combination with version and language)
    },
    name: {
        type: String,
        required: true
    },
    sharingCode: {
        type: String,
        unique: true
    },
    description: String,
    ownedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: [],
    }],
    awaitingStudents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student', 
            required: true, 
            default: []
        }
    ],
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            default: []
        }
    ]
}
const ClassGroupSchema = new Schema<IClassGroup>(ClassGroupFields)
const ClassGroup = model<IClassGroup>('ClassGroup', ClassGroupSchema)

export {
    IClassGroup,
    ClassGroup
}