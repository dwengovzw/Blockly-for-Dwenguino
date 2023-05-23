import { Schema, model } from "mongoose"
import { IUser } from "./user.model"
import  v4 from "uuid/v4"
import { PopulatedDoc } from 'mongoose';

interface ISavedProgram {
    uuid?: string,
    blocklyXml: string,
    savedAt: Date,
    name: string,
    user: PopulatedDoc<IUser>
}
const SavedProgramFields: Record<keyof ISavedProgram, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    blocklyXml: {
        type: String,
        required: true
    },
    savedAt: {
        type: Date,
        required: true
    },
    name: {
        required: true,
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}
const SavedProgramSchema = new Schema<ISavedProgram>(SavedProgramFields)
const SavedProgram = model<ISavedProgram>('SavedProgram', SavedProgramSchema)

export { SavedProgram, ISavedProgram }