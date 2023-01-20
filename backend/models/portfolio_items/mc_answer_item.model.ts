import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface IMCAnswerItemExtraFields {
    selectedAnswer: number
}
interface IMCAnswerItem extends ISolutionItem, IMCAnswerItemExtraFields {}
interface IMCAnswerItemDoc extends IMCAnswerItem, Document {}
const MCAnswerItemSchemaFields: Record<keyof IMCAnswerItemExtraFields, any> = {
    selectedAnswer: {
        type: Number,
        required: true
    }
}
const MCAnswerItemSchema = new Schema(MCAnswerItemSchemaFields)
interface IMCAnswerItemModel extends Model<IMCAnswerItemDoc>{}
const MCAnswerItem = SolutionItem.discriminator<IMCAnswerItemDoc, IMCAnswerItemModel>('MCAnswerItem', MCAnswerItemSchema)

export {
    IMCAnswerItem,
    IMCAnswerItemDoc,
    MCAnswerItem
}