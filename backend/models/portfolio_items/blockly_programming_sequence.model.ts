import { Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model"
import { ILogItem, LogItemSchema } from '../logitem.model'
import { PortfolioItem } from "./portfolio_item.model"
import { ITEMTYPES } from "../../config/itemtypes.config"

interface IBlocklyProgSequenceItemExtraFields {
    eventSequence: [ILogItem],
}
interface IBlocklyProgSequenceItem extends ISolutionItem, IBlocklyProgSequenceItemExtraFields {}
const BlocklyProgSequenceItemSchemaFields: Record<keyof IBlocklyProgSequenceItemExtraFields, any> = {
    eventSequence: [LogItemSchema]

}
const BlocklyProgSequenceItemSchema = SolutionItemSchema(BlocklyProgSequenceItemSchemaFields)
interface IBlocklyProgSequenceItemModel extends Model<IBlocklyProgSequenceItem>{}
const BlocklyProgSequenceItem = PortfolioItem.discriminator<IBlocklyProgSequenceItem, IBlocklyProgSequenceItemModel>(ITEMTYPES.BlocklyProgSequenceItem, BlocklyProgSequenceItemSchema)

export {
    IBlocklyProgSequenceItem,
    BlocklyProgSequenceItem
}