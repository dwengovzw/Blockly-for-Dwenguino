import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model.js"

interface ITextItemExtraFields {
    mdText: string
}
interface ITextItem extends ISolutionItem, ITextItemExtraFields {}
const TextItemSchemaFields: Record<keyof ITextItemExtraFields, any> = {
    mdText: {
        type: String,
        default: ""
    }
}
const TextItemSchema = SolutionItemSchema(TextItemSchemaFields)
interface ITextItemModel extends Model<ITextItem>{}
const TextItem = PortfolioItem.discriminator<ITextItem, ITextItemModel>('TextItem', TextItemSchema)

export {
    ITextItem,
    TextItem
}