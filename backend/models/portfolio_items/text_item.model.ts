import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface ITextItemExtraFields {
    mdText: string
}
interface ITextItem extends ISolutionItem, ITextItemExtraFields {}
interface ITextItemDoc extends ITextItem, Document {}
const TextItemSchemaFields: Record<keyof ITextItemExtraFields, any> = {
    mdText: String
}
const TextItemSchema = new Schema(TextItemSchemaFields)
interface ITextItemModel extends Model<ITextItemDoc>{}
const TextItem = SolutionItem.discriminator<ITextItemDoc, ITextItemModel>('TextItem', TextItemSchema)

export {
    ITextItem,
    ITextItemDoc,
    TextItem
}