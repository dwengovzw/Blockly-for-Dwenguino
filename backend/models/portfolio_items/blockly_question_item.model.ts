import { Document, Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

interface IBlocklyQuestionItemExtraFields {
    questionText: string
}
interface IBlocklyQuestionItem extends IAssignmentItem, IBlocklyQuestionItemExtraFields {}
interface IBlocklyQuestionItemDoc extends IBlocklyQuestionItem, Document {}
const BlocklyQuestionSchemaFields: Record<keyof IBlocklyQuestionItemExtraFields, any> = {
    questionText: String
}
const BlocklyQuestionItemSchema = new Schema(BlocklyQuestionSchemaFields)
interface IBlocklyQuestionItemModel extends Model<IBlocklyQuestionItemDoc>{}
const BlocklyQuestionItem = AssignmentItem.discriminator<IBlocklyQuestionItemDoc, IBlocklyQuestionItemModel>('BlocklyQuestion', BlocklyQuestionItemSchema)

export {
    IBlocklyQuestionItem,
    IBlocklyQuestionItemDoc,
    BlocklyQuestionItem
}