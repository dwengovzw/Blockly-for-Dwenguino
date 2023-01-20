import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUserDoc } from "./users.model.js"

interface ISavedEnvironmentState {
    serializedState: string,
}
interface ISavedEnvironmentStateDoc extends ISavedEnvironmentState, Document {}
const SavedEnvironmentStateFields: Record<keyof ISavedEnvironmentState, any> = {
    serializedState: {
        type: String,
        required: true
    },
}
const SavedEnvironmentStateSchema  = new Schema(SavedEnvironmentStateFields)

export { ISavedEnvironmentState, ISavedEnvironmentStateDoc, SavedEnvironmentStateSchema }