import { Schema, Model } from "mongoose"
import { AssignmentItemSchema, IAssignmentItem } from "./assignment_item.model.js"
import { PortfolioItem } from "./portfolio_item.model.js"

interface IMCQuestionItemExtraFields {
    questionText: string,
    answerOptions: [string],
    correctAnswers: [number]
}
interface IMCQuestionItem extends IAssignmentItem, IMCQuestionItemExtraFields {}
const MCQuestionSchemaFields: Record<keyof IMCQuestionItemExtraFields, any> = {
    questionText: String,
    answerOptions: [String],
    correctAnswers: [String]
}
const MCQuestionItemSchema = AssignmentItemSchema(MCQuestionSchemaFields)
interface IMCQuestionItemModel extends Model<IMCQuestionItem>{}
const MCQuestionItem = PortfolioItem.discriminator<IMCQuestionItem, IMCQuestionItemModel>('MCQuestion', MCQuestionItemSchema)

export {
    IMCQuestionItem,
    MCQuestionItem
}