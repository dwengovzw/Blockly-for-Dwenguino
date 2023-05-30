import { Schema, model, Document } from "mongoose"
import { IUser } from "./user.model"
import  v4 from "uuid/v4"
import { PopulatedDoc } from 'mongoose';

const SAVEDPROGRAM_TYPES = {
    blockly: "blockly", 
    cpp: "cpp"
}

const ENVIRONMENT_VIEW = {
    blocks: "blocks",
    text: "text",
}

const SCENARIO = {
    spyrograph: "spyrograph",
    moving: "moving",
    wall: "wall",
    socialrobot: "socialrobot",
    conveyor: "conveyor"
}

interface ISavedTextualProgram {
    filename: string,
    cppCode: string
}

interface ISavedState {
    uuid?: string,
    blocklyXml: string,
    cppCode: string[],
    socialRobotXml: string,
    savedAt: Date,
    name: string,
    user: PopulatedDoc<IUser>,
    inPortfolio: boolean,
    inSavedItemList: boolean,
    view: string,
    scenario: string
}

interface ISavedStateDoc extends ISavedState, Document {}

const emptyProgramXml: string = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure" id="VhdRW_[ESo[A-z)oA.Ik" x="10" y="10"/></xml>`
const emptySocialRobotDesign: string = `<xml xmlns="http://www.w3.org/1999/xhtml"><Item  Type='background' Class='background1' Id='1'></Item></xml>`

const SavedTextualProgramFields: Record<keyof ISavedTextualProgram, any> = {
    filename: {
        type: String,
        required: true,
        default: "program.cpp"
    },
    cppCode: {
        type: String,
        required: true,
        default: ""
    }
}

const SavedStateFields: Record<keyof ISavedState, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    blocklyXml: {
        type: String,
        required: true,
        default: emptyProgramXml
    },
    cppCode: {
        type: [SavedTextualProgramFields],
        required: true,
        default: []
    },
    socialRobotXml: {
        type: String,
        required: true,
        default: emptySocialRobotDesign
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
    },
    view: {
        type: String,
        required: true,
        default: ENVIRONMENT_VIEW.blocks
    },
    scenario: {
        type: String,
        required: true,
        default: SCENARIO.spyrograph
    }
}
const SavedStateSchema = new Schema<ISavedState>(SavedStateFields)
const SavedState = model<ISavedState>('SavedState', SavedStateSchema)

export { SavedState, ISavedState, ISavedStateDoc, emptyProgramXml, emptySocialRobotDesign, SAVEDPROGRAM_TYPES, SCENARIO, ENVIRONMENT_VIEW }