import { Schema, Model } from "mongoose"
import { PortfolioItem } from "./portfolio_item.model.js"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js"
import { ITEMTYPES } from "../../config/itemtypes.config.js"

interface IAnnotatedDrawingItemExtraFields {
    annotations: [string]
}
interface IAnnotatedDrawingItem extends ISolutionItem, IAnnotatedDrawingItemExtraFields {}
const AnnotatedDrawingItemSchemaFields: Record<keyof IAnnotatedDrawingItemExtraFields, any> = {
    annotations: [String] // TODO: Create sub schema for annotations
}
const AnnotatedDrawingItemSchema = SolutionItemSchema(AnnotatedDrawingItemSchemaFields)
interface IAnnotatedDrawingItemModel extends Model<IAnnotatedDrawingItem>{}
const AnnotatedDrawingItem = PortfolioItem.discriminator<IAnnotatedDrawingItem, IAnnotatedDrawingItemModel>(ITEMTYPES.AnnotatedDrawing, AnnotatedDrawingItemSchema)

export {
    IAnnotatedDrawingItem,
    AnnotatedDrawingItem
}