import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"

interface SavedProgram {
    uuid?: string,
    blocklyXml: string,
    savedAt: Date,
    name: string
}

interface SavedPrograms extends LoadableState {
    programs: SavedProgram[]
}

const initialSavedPrograms: SavedPrograms = {
    programs: []
}

const savedProgramsSlice = createSlice({
    name: "test", 
    initialState: [],
    reducers: {
        /*addProgram: (state, action) => {
            let savedProgram: SavedProgram = {
                uuid: action.payload.uuid,
                blocklyXml: action.payload.blocklyXml,
                savedAt: action.payload.savedAt,
                name: action.payload.name
            }
            state.programs.push(savedProgram)
        },
        setPrograms: (state, action) => {
            state.programs = action.payload
        },
        loading: (state) => {
            state.loading = true
        },
        doneLoading: (state) => {
            state.loading = false
        },*/
    }
})

/*const getAllSavedPrograms = () => {
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/savedprograms/all`, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            })
            let json = await response.json()
            let progs: SavedPrograms[] = json.map((savedProgram) => {return {uuid: savedProgram.uuid, blocklyXml: savedProgram.blocklyXml, savedAt: savedProgram.savedAt, name: savedProgram.name}})
            dispatch(setPrograms(progs))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error getting saved programs"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}*/

//const { addProgram, setPrograms, loading, doneLoading } = savedProgramsSlice.actions

const savedProgramsReducer = savedProgramsSlice.reducer

export { savedProgramsReducer, /*getAllSavedPrograms,*/ SavedProgram }