import { Schema } from "mongoose";
import { PortfolioItem } from "./portfolio_item.model.js";
const AssignmentSchemaFields = {
    ownedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
};
const AssignmentItemSchema = new Schema(AssignmentSchemaFields);
const AssignmentItem = PortfolioItem.discriminator('AssignmentItem', AssignmentItemSchema);
export { AssignmentItem };
//# sourceMappingURL=assignment_item.model.js.map