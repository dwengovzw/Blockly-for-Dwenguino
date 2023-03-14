import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"

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
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/mine`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            let json = await response.json()
            let groups: StudentClassGroupInfo[] = json.classGroups.map((info) => {return {uuid: info.uuid, description: info.description, name: info.name}})
            let pending:  StudentClassGroupInfo[] = json.pendingClassGroups.map((info) => {return {uuid: info.uuid, description: info.description, name: info.name}})
            dispatch(setGroups(groups))
            dispatch(setPending(pending))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error getting classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const leaveClassGroup = (uuid) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/leave/${uuid}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            let json = await response.json()
            dispatch(setNotificationMessage(msg("Left classgroup " + uuid), NotificationMessageType.MESSAGE, 2500))
            dispatch(getAllStudentClassGroups())
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error leaving classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const joinClassGroup = (sharingCode) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/join/${sharingCode}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json"}
            })
            dispatch(setNotificationMessage(msg("Joined classgroup, awaiting approval by teacher"), NotificationMessageType.MESSAGE, 2500))
            dispatch(getAllStudentClassGroups())
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error joining classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const { setGroups, setPending, removeGroup, removePending } = studentClassGroupSlice.actions

const studentClassGroupReducer = studentClassGroupSlice.reducer

export { studentClassGroupReducer, leaveClassGroup, getAllStudentClassGroups, joinClassGroup, StudentClassGroupInfo }