import { Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"
import { ILogItem, LogItemSchema } from '../logitem.model.js'

interface IBlocklyProgSequenceItemExtraFields {
    eventSequence: [ILogItem],
}
interface IBlocklyProgSequenceItem extends ISolutionItem, IBlocklyProgSequenceItemExtraFields {}
const BlocklyProgSequenceItemSchemaFields: Record<keyof IBlocklyProgSequenceItemExtraFields, any> = {
    eventSequence: [LogItemSchema]

}
const BlocklyProgSequenceItemSchema = new Schema<IBlocklyProgSequenceItem>(BlocklyProgSequenceItemSchemaFields)
interface IBlocklyProgSequenceItemModel extends Model<IBlocklyProgSequenceItem>{}
const BlocklyProgSequenceItem = SolutionItem.discriminator<IBlocklyProgSequenceItem, IBlocklyProgSequenceItemModel>('BlocklyProgSequenceItem', BlocklyProgSequenceItemSchema)

export {
    IBlocklyProgSequenceItem,
    BlocklyProgSequenceItem
}