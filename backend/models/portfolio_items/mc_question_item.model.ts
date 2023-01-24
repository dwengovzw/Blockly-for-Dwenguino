import { Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

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
const MCQuestionItemSchema = new Schema<IMCQuestionItem>(MCQuestionSchemaFields)
interface IMCQuestionItemModel extends Model<IMCQuestionItem>{}
const MCQuestionItem = AssignmentItem.discriminator<IMCQuestionItem, IMCQuestionItemModel>('MCQuestion', MCQuestionItemSchema)

export {
    IMCQuestionItem,
    MCQuestionItem
}