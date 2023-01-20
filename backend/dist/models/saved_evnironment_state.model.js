import { Schema } from "mongoose";
const SavedEnvironmentStateFields = {
    serializedState: {
        type: String,
        required: true
    },
};
const SavedEnvironmentStateSchema = new Schema(SavedEnvironmentStateFields);
export { SavedEnvironmentStateSchema };
//# sourceMappingURL=saved_evnironment_state.model.js.map