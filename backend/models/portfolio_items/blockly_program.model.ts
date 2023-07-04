import mongoose, { CallbackError, Model, Schema } from "mongoose";
import { ISavedState, SavedState } from "../saved_state.model";
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model";
import { PortfolioItem } from "./portfolio_item.model";
import { ITEMTYPES } from "../../config/itemtypes.config";

interface IBlocklyProgramItemExtraFields {
    savedState: ISavedState
}

interface IBlocklyProgramItem extends ISolutionItem, IBlocklyProgramItemExtraFields {}
const BlocklyProgramItemSchemaFields: Record<keyof IBlocklyProgramItemExtraFields, any> = {
    savedState: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'SavedState'
    }
}

//const BlocklyProgamItemSchema = SolutionItemSchema(BlocklyProgramItemSchemaFields)

const BlocklyProgamItemSchema = new Schema<IBlocklyProgramItem>(BlocklyProgramItemSchemaFields)

// Recursively delete the saved program when the portfolio item is deleted
BlocklyProgamItemSchema.pre('remove', {document:true, query: false}, async function(next) {
    const savedStateId = this.savedState
    try {
        if (savedStateId){
            await SavedState.findByIdAndRemove(savedStateId)
        }
        next()
    } catch (err: any) {
        next(err as CallbackError)
    }
})


interface IBlocklyProgramItemModel extends Model<IBlocklyProgramItem>{}
const BlocklyProgramItem = PortfolioItem.discriminator<IBlocklyProgramItem, IBlocklyProgramItemModel>(ITEMTYPES.BlocklyProgram, BlocklyProgamItemSchema)

export {
    IBlocklyProgramItem,
    BlocklyProgramItem
}