import { Schema } from "mongoose";
import { SolutionItem } from "./solution_item.model.js";
const AnnotatedDrawingItemSchemaFields = {
    annotations: [String] // TODO: Create sub schema for annotations
};
const AnnotatedDrawingItemSchema = new Schema(AnnotatedDrawingItemSchemaFields);
const AnnotatedDrawingItem = SolutionItem.discriminator('AnnotatedDrawingItem', AnnotatedDrawingItemSchema);
export { AnnotatedDrawingItem };
//# sourceMappingURL=annotated_drawing.model.js.map