import { MinimalUserInfo } from "./user.js";

export interface LogItemInfo {
    timestamp: Date,
    userId?: MinimalUserInfo,
    sessionId?: string,
    activityId?: number,
    eventName: string,
    data?: string,
    functionalVector?: [],
}