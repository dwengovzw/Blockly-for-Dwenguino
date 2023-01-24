import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUser } from "./user.model.js"

interface ISavedProgram {
    blocklyXml: string,
    savedAt: Date,
    name: string,
    user: ID | IUser
}
const SavedProgramFields: Record<keyof ISavedProgram, any> = {
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