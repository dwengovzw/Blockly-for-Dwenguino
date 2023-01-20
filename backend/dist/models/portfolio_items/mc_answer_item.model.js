import { Schema } from "mongoose";
import { SolutionItem } from "./solution_item.model.js";
const MCAnswerItemSchemaFields = {
    selectedAnswer: {
        type: Number,
        required: true
    }
};
const MCAnswerItemSchema = new Schema(MCAnswerItemSchemaFields);
const MCAnswerItem = SolutionItem.discriminator('MCAnswerItem', MCAnswerItemSchema);
export { MCAnswerItem };
//# sourceMappingURL=mc_answer_item.model.js.map