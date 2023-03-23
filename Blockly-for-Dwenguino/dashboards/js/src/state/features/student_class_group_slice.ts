import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"

interface StudentClassGroupInfo {
    uuid : string,
    name: string,
    description: string
}


const initialGroups: StudentClassGroupInfo[] = []
const initialPending: StudentClassGroupInfo[] = []

const initialStudentClassGroups = {
    groups: initialGroups,
    pending: initialPending
}

export const studentClassGroupSlice = createSlice({
    name: "studentClassGroup",
    initialState: initialStudentClassGroups,
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        setPending: (state, action) => {
            state.pending = action.payload
        },
        removeGroup: (state, action) => {
            state.groups = state.groups.filter((info: StudentClassGroupInfo) => {return info.uuid != action.payload.uuid})
        },
        removePending: (state, action) => {
            state.pending = state.pending.filter((info: StudentClassGroupInfo) => {return info.uuid != action.payload.uuid})
        }
    }
})

const getAllStudentClassGroups = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/mine`, "GET", (dispatch: any, getState: any, json: any) => {
        let groups: StudentClassGroupInfo[] = json.classGroups.map((info) => {return {uuid: info.uuid, description: info.description, name: info.name}})
        let pending:  StudentClassGroupInfo[] = json.pendingClassGroups.map((info) => {return {uuid: info.uuid, description: info.description, name: info.name}})
        dispatch(setGroups(groups))
        dispatch(setPending(pending))
        }, null, msg("Error getting classgroup"))
}

const leaveClassGroup = (uuid) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/leave/${uuid}`, "DELETE", (dispatch: any, getState: any, json: any) => {
        dispatch(setNotificationMessage(msg("Left classgroup ") + uuid, NotificationMessageType.MESSAGE, 2500))
        dispatch(getAllStudentClassGroups())
    }, null, msg("Error leaving classgroup"))
}

const joinClassGroup = (sharingCode) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/join/${sharingCode}`, "PUT", (dispatch: any, getState: any, json: any) => {
        dispatch(setNotificationMessage(msg("Joined classgroup, awaiting approval by teacher"), NotificationMessageType.MESSAGE, 2500))
        dispatch(getAllStudentClassGroups())
    }, null, msg("Error joining classgroup"))
}

const { setGroups, setPending, removeGroup, removePending } = studentClassGroupSlice.actions

const studentClassGroupReducer = studentClassGroupSlice.reducer

export { studentClassGroupReducer, leaveClassGroup, getAllStudentClassGroups, joinClassGroup, StudentClassGroupInfo }