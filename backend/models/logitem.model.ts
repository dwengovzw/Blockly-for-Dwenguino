import { Document, Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { IUser } from "./user.model.js";
import { PopulatedDoc } from 'mongoose';

interface ILogItem {
    timestamp: Date,
    userId?: PopulatedDoc<IUser>,
    sessionId?: string,
    activityId?: number,
    eventName: string,
    data?: string,
    functionalVector?: [],
}
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
const LogItemSchema = new Schema<ILogItem>(LogSchemaFields);
const LogItem = model<ILogItem>('loggings', LogItemSchema);

let getLogItem = function (callback, limit) {
    LogItem.find(callback).limit(limit);
}

export { getLogItem, ILogItem, LogSchemaFields, LogItemSchema }

export default LogItem;