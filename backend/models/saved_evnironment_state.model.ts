import { Schema } from "mongoose"
import  v4 from "uuid/v4.js"

interface ISavedEnvironmentState {
    uuid?: string,
    serializedState: string,
}
const SavedEnvironmentStateFields: Record<keyof ISavedEnvironmentState, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    serializedState: {
        type: String,
        required: true
    },
}
const SavedEnvironmentStateSchema  = new Schema<ISavedEnvironmentState>(SavedEnvironmentStateFields)

export { ISavedEnvironmentState, SavedEnvironmentStateSchema }