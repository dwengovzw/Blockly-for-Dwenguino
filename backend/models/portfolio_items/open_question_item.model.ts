import { Document, Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

interface IOpenQuestionItemExtraFields {
    questionText: string
}
interface IOpenQuestionItem extends IAssignmentItem, IOpenQuestionItemExtraFields {}
interface IOpenQuestionItemDoc extends IOpenQuestionItem, Document {}
const OpenQuestionSchemaFields: Record<keyof IOpenQuestionItemExtraFields, any> = {
    questionText: String
}
const OpenQuestionItemSchema = new Schema(OpenQuestionSchemaFields)
interface IOpenQuestionItemModel extends Model<IOpenQuestionItemDoc>{}
const OpenQuestionItem = AssignmentItem.discriminator<IOpenQuestionItemDoc, IOpenQuestionItemModel>('OpenQuestion', OpenQuestionItemSchema)

export {
    IOpenQuestionItem,
    IOpenQuestionItemDoc,
    OpenQuestionItem
}