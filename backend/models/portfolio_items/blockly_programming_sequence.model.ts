import { Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js"
import { ILogItem, LogItemSchema } from '../logitem.model.js'
import { PortfolioItem } from "./portfolio_item.model.js"

interface IBlocklyProgSequenceItemExtraFields {
    eventSequence: [ILogItem],
}
interface IBlocklyProgSequenceItem extends ISolutionItem, IBlocklyProgSequenceItemExtraFields {}
const BlocklyProgSequenceItemSchemaFields: Record<keyof IBlocklyProgSequenceItemExtraFields, any> = {
    eventSequence: [LogItemSchema]

}
const BlocklyProgSequenceItemSchema = SolutionItemSchema(BlocklyProgSequenceItemSchemaFields)
interface IBlocklyProgSequenceItemModel extends Model<IBlocklyProgSequenceItem>{}
const BlocklyProgSequenceItem = PortfolioItem.discriminator<IBlocklyProgSequenceItem, IBlocklyProgSequenceItemModel>('BlocklyProgSequenceItem', BlocklyProgSequenceItemSchema)

export {
    IBlocklyProgSequenceItem,
    BlocklyProgSequenceItem
}