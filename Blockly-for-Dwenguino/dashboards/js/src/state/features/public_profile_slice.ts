import { msg } from "@lit/localize"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { NotificationInfo, setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"

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
        setName: (state: any, action: any) => {
            state.name = action.payload
        }
    }
})

const fetchPublicProfile = (uuid: string) => {
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            let response = await fetch(`${globalSettings.hostname}/user/publicInfo/${uuid}`)
            let info: any = await response.json();
            dispatch(setName(info.firstname + info.lastname))
        } catch (err) {
            dispatch(setNotificationMessage(msg("Unable to fetch public profile information."), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

const { setName } = publicProfileInfoSlice.actions

const publicProfileInfoReducer = publicProfileInfoSlice.reducer

export { publicProfileInfoReducer, fetchPublicProfile }

