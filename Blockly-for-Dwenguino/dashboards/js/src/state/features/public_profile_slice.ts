import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"

interface PublicProfileInfo {
    name: string
}

const initialPublicProfileInfo: PublicProfileInfo = {
    name: ""
}

export const publicProfileInfoSlice = createSlice({
    name: "publicProfile",
    initialState: {name: ""},
    reducers: {
        setMyName: (state, action) => {
            state.name = action.payload.name
        }
    }
})

const fetchPublicProfile = (uuid: string) => {
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            let response = await fetch(`${globalSettings.hostname}/user/publicInfo/${uuid}`)
            let info: any = await response.json();
            let name: string = "no name"
            if (info.firstname){
                name = info.firstname
            } 
            if (info.lastname){
                name += ` ${info.lastname}`
            }
            dispatch(setMyName({name: name}))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Unable to fetch public profile information."), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const { setMyName } = publicProfileInfoSlice.actions

const publicProfileInfoReducer = publicProfileInfoSlice.reducer

export { publicProfileInfoReducer, fetchPublicProfile }

