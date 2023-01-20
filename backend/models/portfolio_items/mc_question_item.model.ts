import { Document, Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

interface IMCQuestionItemExtraFields {
    questionText: string,
    answerOptions: [string],
    correctAnswers: [number]
}
interface IMCQuestionItem extends IAssignmentItem, IMCQuestionItemExtraFields {}
interface IMCQuestionItemDoc extends IMCQuestionItem, Document {}
const MCQuestionSchemaFields: Record<keyof IMCQuestionItemExtraFields, any> = {
    questionText: String,
    answerOptions: [String],
    correctAnswers: [String]
}
const MCQuestionItemSchema = new Schema(MCQuestionSchemaFields)
interface IMCQuestionItemModel extends Model<IMCQuestionItemDoc>{}
const MCQuestionItem = AssignmentItem.discriminator<IMCQuestionItemDoc, IMCQuestionItemModel>('MCQuestion', MCQuestionItemSchema)

export {
    IMCQuestionItem,
    IMCQuestionItemDoc,
    MCQuestionItem
}