import { msg } from "@lit/localize"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { NotificationInfo, setNotificationMessage, NotificationMessageType, loading, doneLoading } from "./notification_slice"
import { fetchAuth, createRequestMiddleware } from "../../middleware/fetch"
import { LoadableState } from "../../util"

interface MinimalUserInfo {
    firstname: string,
    lastname: string,
    uuid: string,
    acceptedTerms: boolean
}

interface MiniamLoggedInUserInfo extends MinimalUserInfo {
    loggedIn: boolean,
    platform: string,
    roles: string[]
}

interface UserInfo extends MiniamLoggedInUserInfo{
    email: string,
    birthdate: string | null,
}

const initialUserState: UserInfo = {
    loggedIn: false,
    firstname: "",
    lastname: "",
    email: "",
    platform: "unknown",
    birthdate: null,
    roles: [],
    uuid: "",
    acceptedTerms: false
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialUserState, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        login: (state: any) => {
            state.loggedIn = true
        },
        logout: (state: any) => {
            state.loggedIn = false
        },
        setInfo: (state, action) => {
            state.loggedIn = action.payload.loggedIn
            state.firstname = action.payload.firstname
            state.lastname = action.payload.lastname
            state.email = action.payload.email
            state.birthdate = action.payload.birthdate
            state.roles = action.payload.roles.map((role) => role.name)
            state.platform = action.payload.platform
            state.uuid = action.payload.uuid
            state.acceptedTerms = action.payload.acceptedTerms
        }
    }
})

const putUserInfo = (userInfo) => {
    return createRequestMiddleware(`${globalSettings.hostname}/user/info`, "PUT", (dispatch: any, getState: any, json: any) => {
        dispatch(setInfo(json))
        dispatch(setNotificationMessage(msg("Profile info saved :)"), NotificationMessageType.MESSAGE, 2500))
    }, userInfo, msg("Error while saving!"))
}


const fetchUserInfo = () => {
    // The inside thunk function
    return async (dispatch: any, getState: any) => {
        try {
            dispatch(loading())
            let response = await fetch(`${globalSettings.hostname}/user/info`)
            if (response.status == 200){
                let info: UserInfo = await response.json();
                dispatch(setInfo(info))
            } else if (response.status == 401){ 
                // Unauthorized => logout
                dispatch(logout())
                dispatch(setNotificationMessage(msg("You are not logged in!"), NotificationMessageType.ERROR, 2500))
            } else if (response.status == 403){
                dispatch(setNotificationMessage(msg("Not allowed to access this route!"), NotificationMessageType.ERROR, 2500))
            } else {
                dispatch(setNotificationMessage(msg("Unable to login!"), NotificationMessageType.ERROR, 2500))
            }
        } catch (err) {
            dispatch(setNotificationMessage(msg("Unable to login!"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}



const { login, logout, setInfo } = userSlice.actions

const userReducer = userSlice.reducer

export { userReducer, fetchUserInfo, login, logout, UserInfo, MiniamLoggedInUserInfo, MinimalUserInfo, initialUserState, putUserInfo }