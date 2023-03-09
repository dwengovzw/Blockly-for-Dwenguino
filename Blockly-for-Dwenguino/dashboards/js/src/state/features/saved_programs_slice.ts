import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
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
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/savedprograms/all`, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            })
            let json = await response.json()
            let progs: SavedProgramInfo[] = json.map((savedProgram) => {return {uuid: savedProgram.uuid, blocklyXml: savedProgram.blocklyXml, savedAt: savedProgram.savedAt, name: savedProgram.name}})
            dispatch(setPrograms(progs))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error getting saved programs"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const deleteSavedProgram = (uuid: string) => {
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/savedprograms/delete/${uuid}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json"}
            })
            if (response.status == 200){
                dispatch(getAllSavedPrograms())
            } else {
                dispatch(setNotificationMessage(msg("Error deleting saved program"), NotificationMessageType.ERROR, 2500))
            }
        } catch (err) {
            dispatch(setNotificationMessage(msg("Error deleting saved program"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const { addProgram, setPrograms } = savedProgramsSlice.actions

const savedProgramsReducer = savedProgramsSlice.reducer

export { savedProgramsReducer, getAllSavedPrograms, SavedProgramInfo, deleteSavedProgram }