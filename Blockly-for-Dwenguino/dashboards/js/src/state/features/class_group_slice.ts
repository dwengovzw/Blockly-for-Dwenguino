import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"
import { UserInfo } from "./user_slice"


interface ClassGroupInfo {
    uuid?: string,
    name: string,
    sharingCode?: string,
    description: string,
    ownedBy?: UserInfo[],
    students?: UserInfo[],
    awaitingStudents?: UserInfo[]
}
interface ClassGroups {
    groups: ClassGroupInfo[],
    currentGroup: ClassGroupInfo | null
}

const initialClassGroupState: ClassGroups = {
    groups: [], 
    currentGroup: null
}
export const classGroupSlice = createSlice({
    name: "classGroup",
    initialState: initialClassGroupState, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        addGroup: (state, action) => {
            let classGroup: ClassGroupInfo = {
                uuid: action.payload.uuid,
                name: action.payload.name,
                sharingCode: action.payload.sharingCode,
                description: action.payload.description
            }
            state.groups.push(classGroup)
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        setCurrentGroup: (state, action) => {
            let classGroup: ClassGroupInfo = {
                uuid: action.payload.uuid,
                name: action.payload.name,
                sharingCode: action.payload.sharingCode,
                description: action.payload.description,
                students: action.payload.students,
                awaitingStudents: action.payload.awaitingStudents,
                ownedBy: action.payload.ownedBy
            }
            state.currentGroup = classGroup
        }
    }
})

const addClassGroup = (classGroupInfo) => {
    return async (dispatch, getState) =>{
        dispatch(loading())
        try {
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/add`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(classGroupInfo)
            })
            let json = await response.json()
            dispatch(addGroup(json))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error adding classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const getAllClassGroups = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/all`, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            })
            let json = await response.json()
            let groups: ClassGroupInfo[] = json.map((info) => {return {name: info.name, description: info.description, sharingCode: info.sharingCode, uuid: info.uuid}})
            dispatch(setGroups(groups))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error getting classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const deleteClassGroup = (uuid: string) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/delete/${uuid}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json"}
            })
            dispatch(getAllClassGroups())
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error deleting classgroup"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const getClassGroup = (uuid: string) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/classgroup/${uuid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            })
            let group = await response.json()
            dispatch(setCurrentGroup(group))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Unable to get classgroup."), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const approveStudent = (classGroupUuid: string, studentUuid: string, approve: boolean) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            let route = ""
            let method = ""
            if (approve){
                route = `${globalSettings.hostname}/classgroup/${classGroupUuid}/approve/${studentUuid}`
                method = "PUT"
            } else {
                route = `${globalSettings.hostname}/classgroup/${classGroupUuid}/reject/${studentUuid}`
                method = "DELETE"
            }
            const response = await fetchAuth(route, {
                method: method,
                headers: { "Content-Type": "application/json"}
            })
            let resp = await response.json()
            dispatch(getClassGroup(classGroupUuid))
        }catch (err) {
            dispatch(setNotificationMessage(msg("Unable to approve student."), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const deleteStudent = (classGroupUuid: string, studentUuid) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            let route = `${globalSettings.hostname}/classgroup/${classGroupUuid}/delete/${studentUuid}`
            let method = "DELETE"
            const response = await fetchAuth(route, {
                method: method,
                headers: { "Content-Type": "application/json"}
            })
            let resp = await response.json()
            dispatch(getClassGroup(classGroupUuid))
        }catch (err) {
            dispatch(setNotificationMessage(msg("Unable to delete student."), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}


const { addGroup, setGroups, setCurrentGroup } = classGroupSlice.actions

const classGroupReducer = classGroupSlice.reducer

export { classGroupReducer, addClassGroup, getAllClassGroups, deleteClassGroup, getClassGroup, approveStudent, deleteStudent, ClassGroupInfo, ClassGroups }