import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model"
import { ITEMTYPES } from "../../config/itemtypes.config"

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
const TextItem = PortfolioItem.discriminator<ITextItem, ITextItemModel>(ITEMTYPES.TextItem, TextItemSchema)

export {
    ITextItem,
    TextItem
}