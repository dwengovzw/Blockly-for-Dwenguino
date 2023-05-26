import mongoose, { Model, Schema } from "mongoose";
import { ISavedProgram, SavedProgram } from "../saved_program.model";
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

// Recursively delete the saved program when the portfolio item is deleted
BlocklyProgamItemSchema.pre('remove', {document:true, query: false}, async function(next) {
    const savedProgramId = this.savedProgram
    try {
        if (savedProgramId){
            await SavedProgram.findByIdAndRemove(savedProgramId)
        }
        next()
    } catch (err) {
        next(err)
    }
})


interface IBlocklyProgramItemModel extends Model<IBlocklyProgramItem>{}
const BlocklyProgramItem = PortfolioItem.discriminator<IBlocklyProgramItem, IBlocklyProgramItemModel>(ITEMTYPES.BlocklyProgram, BlocklyProgamItemSchema)

export {
    IBlocklyProgramItem,
    BlocklyProgramItem
}