import { Schema, model, Document } from "mongoose"
import { IUser } from "./user.model"
import  v4 from "uuid/v4"
import { PopulatedDoc } from 'mongoose';

interface ISavedProgram {
    uuid?: string,
    blocklyXml: string,
    savedAt: Date,
    name: string,
    user: PopulatedDoc<IUser>,
    inPortfolio: boolean,
    inSavedItemList: boolean
}

interface ISavedProgramDoc extends ISavedProgram, Document {}

const emptyProgramXml: string = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure" id="VhdRW_[ESo[A-z)oA.Ik" x="10" y="10"/></xml>`

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
    },
    inPortfolio: {
        type: Boolean,
        required: true,
        default: false
    },
    inSavedItemList: {
        type: Boolean,
        required: true,
        default: true
    }
}
const SavedProgramSchema = new Schema<ISavedProgram>(SavedProgramFields)
const SavedProgram = model<ISavedProgram>('SavedProgram', SavedProgramSchema)

export { SavedProgram, ISavedProgram, ISavedProgramDoc, emptyProgramXml }