import mongoose, { Document, Schema, model } from "mongoose"
import { IUser } from "./user.model.js"
import  v4 from "uuid/v4.js"
import { PopulatedDoc } from 'mongoose';

interface IClassGroup {
    uuid?: string,
    name: string,
    sharingCode?: string,
    description?: string,
    createdAt?: Date,
    ownedBy: PopulatedDoc<IUser>[],
    awaitingStudents: PopulatedDoc<IUser>[],
    students: PopulatedDoc<IUser>[]
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
    createdAt: Date,
    ownedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: [],
    }],
    awaitingStudents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true, 
            default: []
        }
    ],
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
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