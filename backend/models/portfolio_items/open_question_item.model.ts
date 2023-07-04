import { Schema, Model } from "mongoose"
import { AssignmentItemSchema, IAssignmentItem } from "./assignment_item.model"
import { PortfolioItem } from "./portfolio_item.model"
import { ITEMTYPES } from "../../config/itemtypes.config"

interface IOpenQuestionItemExtraFields {
    questionText: string
}
interface IOpenQuestionItem extends IAssignmentItem, IOpenQuestionItemExtraFields {}
const OpenQuestionSchemaFields: Record<keyof IOpenQuestionItemExtraFields, any> = {
    questionText: String
}
const OpenQuestionItemSchema = AssignmentItemSchema(OpenQuestionSchemaFields)
interface IOpenQuestionItemModel extends Model<IOpenQuestionItem>{}
const OpenQuestionItem = PortfolioItem.discriminator<IOpenQuestionItem, IOpenQuestionItemModel>(ITEMTYPES.OpenQuestion, OpenQuestionItemSchema)

export {
    IOpenQuestionItem,
    OpenQuestionItem
}