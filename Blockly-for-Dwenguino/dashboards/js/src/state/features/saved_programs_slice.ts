import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"
import { LoadableState } from "../../util"

interface SavedProgramInfo {
    uuid: string,
    blocklyXml: string,
    savedAt: Date,
    name: string
}


const initialGroups: SavedProgramInfo[] = []
const initialState = 
    {
        programs: initialGroups,
        loading: false
    }



export const savedProgramsSlice = createSlice({
    name: "savedPrograms", 
    initialState: initialState,
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        addProgram: (state, action) => {
            let savedProgram: SavedProgramInfo = {
                uuid: action.payload.uuid,
                blocklyXml: action.payload.blocklyXml,
                savedAt: action.payload.savedAt,
                name: action.payload.name
            }
            state.programs.push(savedProgram)
        },
        setPrograms: (state, action) => {
            state.programs = action.payload
        }
    }
})

const getAllSavedPrograms = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/savedprograms/all`, "GET", (dispatch: any, getState: any, json: any) => {
        let progs: SavedProgramInfo[] = json.map((savedProgram:any) => {return {uuid: savedProgram.uuid, blocklyXml: savedProgram.blocklyXml, savedAt: savedProgram.savedAt, name: savedProgram.name}})
        dispatch(setPrograms(progs))
    }, null, msg("Error getting saved programs"))
}

const deleteSavedProgram = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/savedprograms/delete/${uuid}`, "DELETE", (dispatch: any, getState: any, json: any) => {
        dispatch(getAllSavedPrograms())
    }, null, msg("Error deleting saved program"))
}

const { addProgram, setPrograms } = savedProgramsSlice.actions

const savedProgramsReducer = savedProgramsSlice.reducer

export { savedProgramsReducer, getAllSavedPrograms, SavedProgramInfo, deleteSavedProgram }