import { Schema, Model } from "mongoose"
import { AssignmentItemSchema, IAssignmentItem } from "./assignment_item.model.js"
import { PortfolioItem } from "./portfolio_item.model.js"

interface IOpenQuestionItemExtraFields {
    questionText: string
}
interface IOpenQuestionItem extends IAssignmentItem, IOpenQuestionItemExtraFields {}
const OpenQuestionSchemaFields: Record<keyof IOpenQuestionItemExtraFields, any> = {
    questionText: String
}
const OpenQuestionItemSchema = AssignmentItemSchema(OpenQuestionSchemaFields)
interface IOpenQuestionItemModel extends Model<IOpenQuestionItem>{}
const OpenQuestionItem = PortfolioItem.discriminator<IOpenQuestionItem, IOpenQuestionItemModel>('OpenQuestion', OpenQuestionItemSchema)

export {
    IOpenQuestionItem,
    OpenQuestionItem
}