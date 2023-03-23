import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"
import { MinimalUserInfo, UserInfo } from "./user_slice"
import { ClassGroupInfo } from "./class_group_slice"



interface StudentTeamInfo {
    uuid?: string,
    students: MinimalUserInfo[],
    portfolio?: string // Toto change this to porfolioInfo reference
}


export { StudentTeamInfo }