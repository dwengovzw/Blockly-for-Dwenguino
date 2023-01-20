import { Schema, model } from "mongoose";
const SavedProgramFields = {
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
};
const SavedProgramSchema = new Schema(SavedProgramFields);
const SavedProgram = model('SavedProgram', SavedProgramSchema);
export { SavedProgram };
//# sourceMappingURL=saved_program.model.js.map