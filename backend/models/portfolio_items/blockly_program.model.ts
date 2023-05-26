import { Model, Schema } from "mongoose";
import { ISavedProgram } from "../saved_program.model";
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model";
import { PortfolioItem } from "./portfolio_item.model";
import { ITEMTYPES } from "../../config/itemtypes.config";

interface IBlocklyProgramItemExtraFields {
    savedProgram: ISavedProgram
}

interface IBlocklyProgramItem extends ISolutionItem, IBlocklyProgramItemExtraFields {}
const BlocklyProgramItemSchemaFields: Record<keyof IBlocklyProgramItemExtraFields, any> = {
    savedProgram: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'SavedProgram'
    }
}

//const BlocklyProgamItemSchema = SolutionItemSchema(BlocklyProgramItemSchemaFields)

const BlocklyProgamItemSchema = new Schema<IBlocklyProgramItem>(BlocklyProgramItemSchemaFields)
interface IBlocklyProgramItemModel extends Model<IBlocklyProgramItem>{}
const BlocklyProgramItem = PortfolioItem.discriminator<IBlocklyProgramItem, IBlocklyProgramItemModel>(ITEMTYPES.BlocklyProgram, BlocklyProgamItemSchema)

export {
    IBlocklyProgramItem,
    BlocklyProgramItem
}