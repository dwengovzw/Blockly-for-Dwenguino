import { msg } from "@lit/localize"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { setNotificationMessage, NotificationMessageType } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"


interface ClassGroupInfo extends LoadableState{
    uuid?: string,
    name: string,
    sharingCode?: string,
    description: string,
    ownedBy?: any[],
    students?: any[],
    awaitingStudents?: any[]
}
interface ClassGroups extends LoadableState {
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
        loading: (state) => {
            state.loading = true
        },
        doneLoading: (state) => {
            state.loading = false
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
            console.log(response)
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
            console.log(response)
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
            console.log(err)
        } finally {
            dispatch(doneLoading())
        }
    }
}


const { addGroup, setGroups, loading, doneLoading, setCurrentGroup } = classGroupSlice.actions

const classGroupReducer = classGroupSlice.reducer

export { classGroupReducer, addClassGroup, getAllClassGroups, deleteClassGroup, getClassGroup, ClassGroupInfo, ClassGroups }