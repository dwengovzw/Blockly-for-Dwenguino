import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUserDoc } from "./users.model.js"

interface ISavedProgram {
    blocklyXml: string,
    savedAt?: Date,
    name: string,
    user: ID | IUserDoc
}
interface ISavedProgramDoc extends ISavedProgram, Document {}
const SavedProgramFields: Record<keyof ISavedProgram, any> = {
    blocklyXml: {
        type: String,
        required: true
    },
    savedAt: Date,
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
const SavedProgramSchema = new Schema(SavedProgramFields)
const SavedProgram = model<ISavedProgramDoc>('SavedProgram', SavedProgramSchema)

export { SavedProgram, ISavedProgram, ISavedProgramDoc }