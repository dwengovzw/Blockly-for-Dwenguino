import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"
import { LoadableState } from "../../util"
import { UserInfo } from "./user_slice"


interface ClassGroupInfo {
    uuid?: string,
    name: string,
    sharingCode?: string,
    description: string,
    createdAt?: string,
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
            console.log((new Date(action.payload.createdAt)).toLocaleDateString(msg("en-GB")));
            let classGroup: ClassGroupInfo = {
                uuid: action.payload.uuid,
                name: action.payload.name,
                sharingCode: action.payload.sharingCode,
                description: action.payload.description,
                createdAt: action.payload.createdAt,
                students: action.payload.students,
                awaitingStudents: action.payload.awaitingStudents,
                ownedBy: action.payload.ownedBy
            }
            state.currentGroup = classGroup
        }
    }
})

const addClassGroup = (classGroupInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/add`, "PUT", (dispatch, getState, json) => {
        dispatch(getAllClassGroups())
    }, classGroupInfo, msg("Error adding classgroup"))
}

const getAllClassGroups = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/all`, "GET", (dispatch, getState, json) => {
        let groups: ClassGroupInfo[] = json.map((info) => {return {name: info.name, description: info.description, sharingCode: info.sharingCode, uuid: info.uuid, createdAt: (new Date(info.createdAt)).toLocaleDateString(msg("en-GB")).split("T")[0]}})
        dispatch(setGroups(groups))
    }, {}, msg("Error getting classgroup"))
}

const deleteClassGroup = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/delete/${uuid}`, "DELETE", (dispatch, getState, json) => {
        dispatch(getAllClassGroups())
    }, {}, msg("Error deleting classgroup"))
}

const getClassGroup = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/${uuid}`, "GET", (dispatch, getState, json) => {
        dispatch(setCurrentGroup(json))
    }, {}, msg("Error getting classgroup"))
}

const approveStudent = (classGroupUuid: string, studentUuid: string, approve: boolean) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/${classGroupUuid}/${approve ? "approve" : "reject"}/${studentUuid}`, approve ? "PUT" : "DELETE", (dispatch, getState, json) => {
        dispatch(getClassGroup(classGroupUuid))
    }, {}, msg("Error approving student"))
}

const deleteStudent = (classGroupUuid: string, studentUuid) => {
    return createRequestMiddleware(`${globalSettings.hostname}/classgroup/${classGroupUuid}/delete/${studentUuid}`, "DELETE", (dispatch, getState, json) => {
        dispatch(getClassGroup(classGroupUuid))
    }, {}, msg("Error deleting student"))
}


const { addGroup, setGroups, setCurrentGroup } = classGroupSlice.actions

const classGroupReducer = classGroupSlice.reducer

export { classGroupReducer, addClassGroup, getAllClassGroups, deleteClassGroup, getClassGroup, approveStudent, deleteStudent, ClassGroupInfo, ClassGroups }