import { Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface IAnnotatedDrawingItemExtraFields {
    annotations: [string]
}
interface IAnnotatedDrawingItem extends ISolutionItem, IAnnotatedDrawingItemExtraFields {}
const AnnotatedDrawingItemSchemaFields: Record<keyof IAnnotatedDrawingItemExtraFields, any> = {
    annotations: [String] // TODO: Create sub schema for annotations
}
const AnnotatedDrawingItemSchema = new Schema<IAnnotatedDrawingItem>(AnnotatedDrawingItemSchemaFields)
interface IAnnotatedDrawingItemModel extends Model<IAnnotatedDrawingItem>{}
const AnnotatedDrawingItem = SolutionItem.discriminator<IAnnotatedDrawingItem, IAnnotatedDrawingItemModel>('AnnotatedDrawingItem', AnnotatedDrawingItemSchema)

export {
    IAnnotatedDrawingItem,
    AnnotatedDrawingItem
}