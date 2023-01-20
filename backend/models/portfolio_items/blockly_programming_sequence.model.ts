import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"
import { ILogItem, LogItemSchema } from '../logitem.model.js'

interface IBlocklyProgSequenceItemExtraFields {
    eventSequence: [ILogItem],
}
interface IBlocklyProgSequenceItem extends ISolutionItem, IBlocklyProgSequenceItemExtraFields {}
interface IBlocklyProgSequenceItemDoc extends IBlocklyProgSequenceItem, Document {}
const BlocklyProgSequenceItemSchemaFields: Record<keyof IBlocklyProgSequenceItemExtraFields, any> = {
    eventSequence: [LogItemSchema]

}
const BlocklyProgSequenceItemSchema = new Schema(BlocklyProgSequenceItemSchemaFields)
interface IBlocklyProgSequenceItemModel extends Model<IBlocklyProgSequenceItemDoc>{}
const BlocklyProgSequenceItem = SolutionItem.discriminator<IBlocklyProgSequenceItemDoc, IBlocklyProgSequenceItemModel>('BlocklyProgSequenceItem', BlocklyProgSequenceItemSchema)

export {
    IBlocklyProgSequenceItem,
    IBlocklyProgSequenceItemDoc,
    BlocklyProgSequenceItem
}