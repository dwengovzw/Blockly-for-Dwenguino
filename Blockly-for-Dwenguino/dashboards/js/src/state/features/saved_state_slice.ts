import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"
import { LoadableState } from "../../util"

interface SavedStateInfo {
    uuid: string,
    blocklyXml: string,
    cppCode: string[],
    socialRobotXml: string,
    savedAt: string,
    name: string,
    view: string,
    scenario: string
}


const initialGroups: SavedStateInfo[] = []
const initialState = 
    {
        states: initialGroups,
        loading: false
    }



export const savedProgramsSlice = createSlice({
    name: "savedState", 
    initialState: initialState,
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        addProgram: (state, action) => {
            let savedState: SavedStateInfo = {
                uuid: action.payload.uuid,
                blocklyXml: action.payload.blocklyXml,
                cppCode: action.payload.cppCode,
                socialRobotXml: action.payload.socialRobotXml,
                view: action.payload.view,
                scenario: action.payload.scenario,
                savedAt: action.payload.savedAt,
                name: action.payload.name
            }
            state.states.push(savedState)
        },
        setPrograms: (state, action) => {
            state.states = action.payload
            // state.states = action.payload.map((savedProgram:any) => {
            //     return {
            //     ...savedProgram,
            //     savedAt: new Date(Date.parse(savedProgram.savedAt))
            //     }
            // })
        }
    }
})

const getAllSavedStates = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/savedstates/all`, "GET", (dispatch: any, getState: any, json: any) => {
        let progs: SavedStateInfo[] = json.map((savedProgram:any) => {
            return {
                uuid: savedProgram.uuid, 
                blocklyXml: savedProgram.blocklyXml, 
                savedAt: savedProgram.savedAt, 
                name: savedProgram.name,
                view: savedProgram.view,
                scenario: savedProgram.scenario,
                cppCode: savedProgram.cppCode,
                socialRobotXml: savedProgram.socialRobotXml,
            }})
        dispatch(setPrograms(progs))
    }, null, msg("Error getting saved programs"))
}

const deleteSavedState = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/savedstates/delete/${uuid}`, "DELETE", (dispatch: any, getState: any, json: any) => {
        dispatch(getAllSavedStates())
    }, null, msg("Error deleting saved program"))
}

const updateSavedStateName = (savedState: SavedStateInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/savedstates/updateName`, "PUT", (dispatch: any, getState: any, json: any) => {
        dispatch(getAllSavedStates())
    }, savedState, msg("Error updating saved program"))
}

const { addProgram, setPrograms } = savedProgramsSlice.actions

const savedStatesReducer = savedProgramsSlice.reducer

export { savedStatesReducer, getAllSavedStates, updateSavedStateName, SavedStateInfo, deleteSavedState }