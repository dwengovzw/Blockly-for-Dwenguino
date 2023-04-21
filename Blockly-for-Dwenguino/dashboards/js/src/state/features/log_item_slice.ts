import { MinimalUserInfo } from "./user_slice";

interface LogItemInfo {
    timestamp: Date,
    userId?: MinimalUserInfo,
    sessionId?: string,
    activityId?: number,
    eventName: string,
    data?: string,
    functionalVector?: [],
}

export { LogItemInfo }