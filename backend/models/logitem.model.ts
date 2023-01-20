import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUserDoc } from "./users.model.js";

interface ILogItem {
    timestamp: Date,
    userId?: ID | IUserDoc,
    sessionId?: string,
    activityId?: number,
    eventName: string,
    data?: string,
    functionalVector?: [],
}
interface ILogItemDoc extends ILogItem, Document{}
const LogSchemaFields: Record<keyof ILogItem, any> = {
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
    activityId: { // TODO rename or reimplement
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
}

// Setup schema
const LogItemSchema = new Schema(LogSchemaFields);
const LogItem = model('loggings', LogItemSchema);

let getLogItem = function (callback, limit) {
    LogItem.find(callback).limit(limit);
}

export { getLogItem, ILogItem, ILogItemDoc, LogSchemaFields, LogItemSchema }

export default LogItem;