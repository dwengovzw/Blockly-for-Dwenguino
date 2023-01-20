import { Schema, model } from "mongoose";
const LogSchemaFields = {
    timestamp: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    sessionId: {
        type: String,
        required: false
    },
    activityId: {
        type: Number,
        required: false
    },
    eventName: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: false
    },
    functionalVector: {
        type: Array,
        required: false
    }
};
// Setup schema
const LogItemSchema = new Schema(LogSchemaFields);
const LogItem = model('loggings', LogItemSchema);
let getLogItem = function (callback, limit) {
    LogItem.find(callback).limit(limit);
};
export { getLogItem, LogSchemaFields, LogItemSchema };
export default LogItem;
//# sourceMappingURL=logitem.model.js.map