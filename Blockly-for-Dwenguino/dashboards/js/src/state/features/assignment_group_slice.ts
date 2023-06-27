import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"
import { LoadableState } from "../../util"
import { MinimalUserInfo } from "./user_slice"
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
    return createRequestMiddleware(`${globalSettings.hostname}/assignment/all/${classGroupUUID}`, "GET", (dispatch, getState, json) => {
        let groups: AssignmentGroupInfo[] = json.map(
            (assignmentGroup: AssignmentGroupInfo) => {
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
                                let s: MinimalUserInfo = {
                                    firstname: student.firstname,
                                    lastname: student.lastname,
                                    uuid: student.uuid,
                                    acceptedTerms: student.acceptedTerms
                                }
                                return s
                            })
                        }
                        return sTeam
                    })
                }
            }
        )
        dispatch(setGroups(groups))
    }, {}, msg("Error getting assignments"))
}

const saveAssignmentGroup = (assignmentGroupInfo: AssignmentGroupInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/assignment/add/${assignmentGroupInfo.inClassGroupUUID}`, "PUT", (dispatch, getState, json) => {
        dispatch(getAllAssignmentGroups(assignmentGroupInfo.inClassGroupUUID))
    }, assignmentGroupInfo, msg("Error adding assignment"))
}

const deleteAssignmentGroup = (classGroupUUID: string, assignmentUUID: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/assignment/${assignmentUUID}`, "DELETE", (dispatch, getState, json) => {
        dispatch(getAllAssignmentGroups(classGroupUUID))
    }, {}, msg("Error deleting assignment"))

}

const favortieAssignmentGroup = (classGroupUUID: string, assignmentUUID: string, isFavorite:boolean) => {
    return createRequestMiddleware(
        `${globalSettings.hostname}/assignment/favorite/${assignmentUUID}`, "PUT", (dispatch, getState, json) => {
            dispatch(getAllAssignmentGroups(classGroupUUID))
        }, {favorite: isFavorite}, msg("Error starring assignment")
    )
}

const { addGroup, setGroups } = assignmentGroupSlice.actions

const assignmentGroupReducer = assignmentGroupSlice.reducer

export { AssignmentGroupInfo, assignmentGroupReducer, saveAssignmentGroup, getAllAssignmentGroups, deleteAssignmentGroup, favortieAssignmentGroup }
