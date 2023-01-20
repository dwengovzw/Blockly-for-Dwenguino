import { Schema } from "mongoose";
import { AssignmentItem } from "./assignment_item.model.js";
const BlocklyQuestionSchemaFields = {
    questionText: String
};
const BlocklyQuestionItemSchema = new Schema(BlocklyQuestionSchemaFields);
const BlocklyQuestionItem = AssignmentItem.discriminator('BlocklyQuestion', BlocklyQuestionItemSchema);
export { BlocklyQuestionItem };
//# sourceMappingURL=blockly_question_item.model.js.map