import { Document, Schema, Model } from "mongoose"
import { ID } from "../modelutils.js"
import { ITeacher } from "../user.model.js"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model.js"

interface IAssignmentItemExtraFields {
    ownedBy: ID | ITeacher
}
interface IAssignmentItem extends IPortfolioItem, IAssignmentItemExtraFields {}
const AssignmentSchemaFields: Record<keyof IAssignmentItemExtraFields, any> = {
    ownedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}
const AssignmentItemSchema = new Schema<IAssignmentItem>(AssignmentSchemaFields)
interface IAssignmentItemModel extends Model<IAssignmentItem>{}
const AssignmentItem = PortfolioItem.discriminator<IAssignmentItem, IAssignmentItemModel>('AssignmentItem', AssignmentItemSchema);

export {
    IAssignmentItem,
    AssignmentItem
}