import mongoose, { CallbackError, Model, Schema } from "mongoose";
import { SavedState } from "../saved_state.model.js";
import { ISavedState } from "../../../shared/types/saved_state.types.js";
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js";
import { PortfolioItem } from "./portfolio_item.model.js";
import { ITEMTYPES } from "../../../shared/constants/itemtypes.config.js";

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

const BlocklyProgamItemSchema = new Schema<IBlocklyProgramItem, IBlocklyProgramItemModel>(BlocklyProgramItemSchemaFields)

// Recursively delete the saved program when the portfolio item is deleted
BlocklyProgamItemSchema.pre('deleteOne', {document:true, query: false}, async function(next: any) {
    const savedStateId: any = this.savedState
    try {
        if (savedStateId){
            await SavedState.findOneAndDelete(savedStateId)
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