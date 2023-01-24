import { Document, Schema, Model } from "mongoose"
import { ID } from "../modelutils.js"
import { ITeacher } from "../user.model.js"
import { IAssignmentItem } from "./assignment_item.model.js"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model.js"

interface ISolutionItemExtraFields {
    solutionTo?: ID | IAssignmentItem
}
interface ISolutionItem extends IPortfolioItem, ISolutionItemExtraFields {}
const SolutionSchemaFields: Record<keyof ISolutionItemExtraFields, any> = {
    solutionTo:{
        type: Schema.Types.ObjectId,
        ref: 'AssignmentItem',
        required: false
    }
}
const SolutionItemSchema = new Schema<ISolutionItem>(SolutionSchemaFields)
interface ISolutionItemModel extends Model<ISolutionItem>{}
const SolutionItem = PortfolioItem.discriminator<ISolutionItem, ISolutionItemModel>('SolutionItem', SolutionItemSchema)

export {
    ISolutionItem,
    SolutionItem
}