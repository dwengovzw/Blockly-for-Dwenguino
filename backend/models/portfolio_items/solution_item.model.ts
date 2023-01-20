import { Document, Schema, Model } from "mongoose"
import { ID } from "../modelutils.js"
import { ITeacherDoc } from "../users.model.js"
import { IAssignmentItemDoc } from "./assignment_item.model.js"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model.js"

interface ISolutionItemExtraFields {
    solutionTo?: ID | IAssignmentItemDoc
}
interface ISolutionItem extends IPortfolioItem, ISolutionItemExtraFields {}
interface ISolutionItemDoc extends ISolutionItem, Document {}
const SolutionSchemaFields: Record<keyof ISolutionItemExtraFields, any> = {
    solutionTo:{
        type: Schema.Types.ObjectId,
        ref: 'AssignmentItem',
        required: false
    }
}
const SolutionItemSchema = new Schema(SolutionSchemaFields)
interface ISolutionItemModel extends Model<ISolutionItemDoc>{}
const SolutionItem = PortfolioItem.discriminator<ISolutionItemDoc, ISolutionItemModel>('SolutionItem', SolutionItemSchema)

export {
    ISolutionItem,
    ISolutionItemDoc,
    SolutionItem
}