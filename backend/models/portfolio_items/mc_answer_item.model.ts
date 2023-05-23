import { Schema, Model } from "mongoose"
import { PortfolioItem } from "./portfolio_item.model"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model"
import { ITEMTYPES } from "../../config/itemtypes.config"

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
const MCAnswerItem = PortfolioItem.discriminator<IMCAnswerItem, IMCAnswerItemModel>(ITEMTYPES.MCAnswerItem, MCAnswerItemSchema)

export {
    IMCAnswerItem,
    MCAnswerItem
}