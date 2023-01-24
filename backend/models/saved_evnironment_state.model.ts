import { Schema } from "mongoose"

interface ISavedEnvironmentState {
    serializedState: string,
}
const SavedEnvironmentStateFields: Record<keyof ISavedEnvironmentState, any> = {
    serializedState: {
        type: String,
        required: true
    },
}
const SavedEnvironmentStateSchema  = new Schema<ISavedEnvironmentState>(SavedEnvironmentStateFields)

export { ISavedEnvironmentState, SavedEnvironmentStateSchema }