import { Schema, Model } from "mongoose"
import { AssignmentItemSchema, IAssignmentItem } from "./assignment_item.model.js"
import { PortfolioItem } from "./portfolio_item.model.js"
import { ITEMTYPES } from "../../config/itemtypes.config.js"

interface IBlocklyQuestionItemExtraFields {
    questionText: string
}
interface IBlocklyQuestionItem extends IAssignmentItem, IBlocklyQuestionItemExtraFields {}
const BlocklyQuestionSchemaFields: Record<keyof IBlocklyQuestionItemExtraFields, any> = {
    questionText: String
}
const BlocklyQuestionItemSchema = AssignmentItemSchema(BlocklyQuestionSchemaFields)
interface IBlocklyQuestionItemModel extends Model<IBlocklyQuestionItem>{}
const BlocklyQuestionItem = PortfolioItem.discriminator<IBlocklyQuestionItem, IBlocklyQuestionItemModel>(ITEMTYPES.BlocklyQuestion, BlocklyQuestionItemSchema)

export {
    IBlocklyQuestionItem,
    BlocklyQuestionItem
}