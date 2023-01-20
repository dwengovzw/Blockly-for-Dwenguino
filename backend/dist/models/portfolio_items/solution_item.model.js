import { Schema } from "mongoose";
import { PortfolioItem } from "./portfolio_item.model.js";
const SolutionSchemaFields = {
    solutionTo: {
        type: Schema.Types.ObjectId,
        ref: 'AssignmentItem',
        required: false
    }
};
const SolutionItemSchema = new Schema(SolutionSchemaFields);
const SolutionItem = PortfolioItem.discriminator('SolutionItem', SolutionItemSchema);
export { SolutionItem };
//# sourceMappingURL=solution_item.model.js.map