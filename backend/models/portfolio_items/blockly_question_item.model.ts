import { Schema, Model } from "mongoose"
import { AssignmentItem, IAssignmentItem } from "./assignment_item.model.js"

interface IBlocklyQuestionItemExtraFields {
    questionText: string
}
interface IBlocklyQuestionItem extends IAssignmentItem, IBlocklyQuestionItemExtraFields {}
const BlocklyQuestionSchemaFields: Record<keyof IBlocklyQuestionItemExtraFields, any> = {
    questionText: String
}
const BlocklyQuestionItemSchema = new Schema<IBlocklyQuestionItem>(BlocklyQuestionSchemaFields)
interface IBlocklyQuestionItemModel extends Model<IBlocklyQuestionItem>{}
const BlocklyQuestionItem = AssignmentItem.discriminator<IBlocklyQuestionItem, IBlocklyQuestionItemModel>('BlocklyQuestion', BlocklyQuestionItemSchema)

export {
    IBlocklyQuestionItem,
    BlocklyQuestionItem
}