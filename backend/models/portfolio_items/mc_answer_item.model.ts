import { Schema, Model } from "mongoose"
import { PortfolioItem } from "./portfolio_item.model.js"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js"

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
const MCAnswerItemSchema = SolutionItemSchema(MCAnswerItemSchemaFields)
interface IMCAnswerItemModel extends Model<IMCAnswerItem>{}
const MCAnswerItem = PortfolioItem.discriminator<IMCAnswerItem, IMCAnswerItemModel>('MCAnswerItem', MCAnswerItemSchema)

export {
    IMCAnswerItem,
    MCAnswerItem
}