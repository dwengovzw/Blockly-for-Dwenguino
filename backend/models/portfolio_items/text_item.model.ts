import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface ITextItemExtraFields {
    mdText: string
}
interface ITextItem extends ISolutionItem, ITextItemExtraFields {}
const TextItemSchemaFields: Record<keyof ITextItemExtraFields, any> = {
    mdText: String
}
const TextItemSchema = new Schema<ITextItem>(TextItemSchemaFields)
interface ITextItemModel extends Model<ITextItem>{}
const TextItem = SolutionItem.discriminator<ITextItem, ITextItemModel>('TextItem', TextItemSchema)

export {
    ITextItem,
    TextItem
}