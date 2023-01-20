import { Schema } from "mongoose";
import { AssignmentItem } from "./assignment_item.model.js";
const MCQuestionSchemaFields = {
    questionText: String,
    answerOptions: [String],
    correctAnswers: [String]
};
const MCQuestionItemSchema = new Schema(MCQuestionSchemaFields);
const MCQuestionItem = AssignmentItem.discriminator('MCQuestion', MCQuestionItemSchema);
export { MCQuestionItem };
//# sourceMappingURL=mc_question_item.model.js.map