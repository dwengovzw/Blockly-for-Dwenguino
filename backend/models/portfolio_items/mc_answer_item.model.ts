import { Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface IMCAnswerItemExtraFields {
    selectedAnswer: number
}
interface IMCAnswerItem extends ISolutionItem, IMCAnswerItemExtraFields {}
const MCAnswerItemSchemaFields: Record<keyof IMCAnswerItemExtraFields, any> = {
    selectedAnswer: {
        type: Number,
        required: true
    }
}
const MCAnswerItemSchema = new Schema<IMCAnswerItem>(MCAnswerItemSchemaFields)
interface IMCAnswerItemModel extends Model<IMCAnswerItem>{}
const MCAnswerItem = SolutionItem.discriminator<IMCAnswerItem, IMCAnswerItemModel>('MCAnswerItem', MCAnswerItemSchema)

export {
    IMCAnswerItem,
    MCAnswerItem
}