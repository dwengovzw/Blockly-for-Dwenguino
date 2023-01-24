import { Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

interface IOpenQuestionItemExtraFields {
    questionText: string
}
interface IOpenQuestionItem extends IAssignmentItem, IOpenQuestionItemExtraFields {}
const OpenQuestionSchemaFields: Record<keyof IOpenQuestionItemExtraFields, any> = {
    questionText: String
}
const OpenQuestionItemSchema = new Schema<IOpenQuestionItem>(OpenQuestionSchemaFields)
interface IOpenQuestionItemModel extends Model<IOpenQuestionItem>{}
const OpenQuestionItem = AssignmentItem.discriminator<IOpenQuestionItem, IOpenQuestionItemModel>('OpenQuestion', OpenQuestionItemSchema)

export {
    IOpenQuestionItem,
    OpenQuestionItem
}