import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"
import { UserInfo } from "./user_slice"
import { ClassGroupInfo } from "./class_group_slice"
import { StudentTeamInfo } from "./student_team_slice"

// TODO: move this to separate slice and update with correct types

interface AssignmentGroupInfo {
    uuid?: string,
    name: string,
    description?: string,
    starred?: boolean,
    studentTeams: StudentTeamInfo[],
    inClassGroupUUID: string
}

interface AssignmentGroups {
    groups: AssignmentGroupInfo[]
}

const initialAssignmentGroups = {
    groups: []
}

export const assignmentGroupSlice = createSlice({
    name: "assignmentGroup",
    initialState: initialAssignmentGroups,
    reducers: {
        addGroup: (state, action) => {
            let assignmentGroup: AssignmentGroupInfo = {
                uuid: action.payload.uuid,
                name: action.payload.name,
                description: action.payload.description,
                starred: action.payload.starred,
                studentTeams: action.payload.studentTeams,
                inClassGroupUUID: action.payload.inClassGroup
            }
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
    }
})

const getAllAssignmentGroups = (classGroupUUID: string) => {
    return async (dispatch, getState) => {
        dispatch(loading())
        try {
            const response = await fetchAuth(`${globalSettings.hostname}/assignment/all/${classGroupUUID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json"},
            })
            let json = await response.json()
            let groups: AssignmentGroupInfo[] = json.map(
                (assignmentGroup) => {
                    return {
                        uuid: assignmentGroup.uuid,
                        name: assignmentGroup.name,
                        description: assignmentGroup.description,
                        starred: assignmentGroup.starred,
                        inClassGroupUUID: classGroupUUID,
                        studentTeams: assignmentGroup.studentTeams.map((team) => {
                            let sTeam: StudentTeamInfo = {
                                uuid: team.uuid,
                                students: team.students.map((student) => {
                                    return {
                                        firstname: student.firstname,
                                        lastname: student.lastname,
                                        uuid: student.uuid
                                    }
                                })
                            }
                            return sTeam
                        })
                    }
                }
            )
            dispatch(setGroups(groups))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error getting assignments"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const createAssignmentGroup = (assignmentGroupInfo: AssignmentGroupInfo) => {
    return async (dispatch, getState) => {
        dispatch(loading())
        try {
            const response = await fetchAuth(`${globalSettings.hostname}/assignment/add/${assignmentGroupInfo.inClassGroupUUID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(assignmentGroupInfo)
            })
            let json = await response.json()
            dispatch(getAllAssignmentGroups(assignmentGroupInfo.inClassGroupUUID))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error adding assignment"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const deleteAssignmentGroup = (classGroupUUID: string, assignmentUUID: string) => {
    return async (dispatch, getState) => {
        dispatch(loading())
        try {
            const response = await fetchAuth(`${globalSettings.hostname}/assignment/${assignmentUUID}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json"}
            })
            let json = await response.json()
            dispatch(getAllAssignmentGroups(classGroupUUID))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error adding assignment"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const { addGroup, setGroups } = assignmentGroupSlice.actions

const assignmentGroupReducer = assignmentGroupSlice.reducer

export { AssignmentGroupInfo, assignmentGroupReducer, createAssignmentGroup, getAllAssignmentGroups, deleteAssignmentGroup }
