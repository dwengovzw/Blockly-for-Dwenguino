import { Schema, model, Document, PopulatedDoc } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import {
  ISavedState,
  ISavedTextualProgram,
  emptyProgramXml,
  emptySocialRobotDesign,
  ENVIRONMENT_VIEW,
  SCENARIO
} from "../../shared/types/saved_state.types.js";

import { IUser } from "./user.model.js";

/* ---------- Mongoose document type ---------- */

export interface ISavedStateDoc
  extends Omit<ISavedState, "user">,
    Document {
  user: PopulatedDoc<IUser>;
}

/* ---------- Subdocument schema ---------- */

const SavedTextualProgramFieldsSchema = new Schema<ISavedTextualProgram>({
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
});

/* ---------- Main schema ---------- */

const SavedStateSchema = new Schema<ISavedStateDoc>({
  uuid: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  blocklyXml: {
    type: String,
    required: true,
    default: emptyProgramXml
  },
  cppCode: {
    type: [SavedTextualProgramFieldsSchema],
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
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
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
});


const SavedState = model<ISavedStateDoc>('SavedState', SavedStateSchema)

const SavedTextualProgram = model<ISavedTextualProgram>('SavedTextualProgram', SavedTextualProgramFieldsSchema)


/* ---------- Model ---------- */

export {
  SavedState, 
  SavedTextualProgram,
  ISavedState,
}
