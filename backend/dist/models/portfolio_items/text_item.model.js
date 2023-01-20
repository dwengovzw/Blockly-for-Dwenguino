import { Schema } from "mongoose";
import { SolutionItem } from "./solution_item.model.js";
const TextItemSchemaFields = {
    mdText: String
};
const TextItemSchema = new Schema(TextItemSchemaFields);
const TextItem = SolutionItem.discriminator('TextItem', TextItemSchema);
export { TextItem };
//# sourceMappingURL=text_item.model.js.map