import { Schema } from "mongoose";
import { AssignmentItem } from "./assignment_item.model.js";
const OpenQuestionSchemaFields = {
    questionText: String
};
const OpenQuestionItemSchema = new Schema(OpenQuestionSchemaFields);
const OpenQuestionItem = AssignmentItem.discriminator('OpenQuestion', OpenQuestionItemSchema);
export { OpenQuestionItem };
//# sourceMappingURL=open_question_item.model.js.map