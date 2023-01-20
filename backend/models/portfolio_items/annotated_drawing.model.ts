import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface IAnnotatedDrawingItemExtraFields {
    annotations: [string]
}
interface IAnnotatedDrawingItem extends ISolutionItem, IAnnotatedDrawingItemExtraFields {}
interface IAnnotatedDrawingItemDoc extends IAnnotatedDrawingItem, Document {}
const AnnotatedDrawingItemSchemaFields: Record<keyof IAnnotatedDrawingItemExtraFields, any> = {
    annotations: [String] // TODO: Create sub schema for annotations
}
const AnnotatedDrawingItemSchema = new Schema(AnnotatedDrawingItemSchemaFields)
interface IAnnotatedDrawingItemModel extends Model<IAnnotatedDrawingItemDoc>{}
const AnnotatedDrawingItem = SolutionItem.discriminator<IAnnotatedDrawingItemDoc, IAnnotatedDrawingItemModel>('AnnotatedDrawingItem', AnnotatedDrawingItemSchema)

export {
    IAnnotatedDrawingItem,
    IAnnotatedDrawingItemDoc,
    AnnotatedDrawingItem
}