import { Document, Schema, Model } from "mongoose"
import { ID } from "../modelutils.js"
import { ITeacherDoc } from "../users.model.js"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model.js"

interface IAssignmentItemExtraFields {
    ownedBy: ID | ITeacherDoc
}
interface IAssignmentItem extends IPortfolioItem, IAssignmentItemExtraFields {}
interface IAssignmentItemDoc extends IAssignmentItem, Document {}
const AssignmentSchemaFields: Record<keyof IAssignmentItemExtraFields, any> = {
    ownedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}
const AssignmentItemSchema = new Schema(AssignmentSchemaFields)
interface IAssignmentItemModel extends Model<IAssignmentItemDoc>{}
const AssignmentItem = PortfolioItem.discriminator<IAssignmentItemDoc, IAssignmentItemModel>('AssignmentItem', AssignmentItemSchema);

export {
    IAssignmentItem,
    IAssignmentItemDoc,
    AssignmentItem
}