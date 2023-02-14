import { msg } from "@lit/localize"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { setNotification, NotificationInfo } from "./notification_slice"
import { fetchAuth } from "../../middleware/fetch"
import { LoadableState } from "../../util"


interface UserInfo extends LoadableState{
    loggedIn: boolean,
    firstname: string,
    lastname: string,
    email: string,
    platform?: string,
    birthdate: string | null,
    roles: string[],
    loading: boolean
}

const initialUserState: UserInfo = {
    loggedIn: false,
    firstname: "",
    lastname: "",
    email: "",
    platform: "unknown",
    birthdate: null,
    roles: [],
    loading: false
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
        }, 
        loading: (state) => {
            state.loading = true;
        },
        doneLoading: (state) => {
            state.loading = false
        }
    }
})

const putUserInfo = (userInfo) => {
    return async (dispatch, getState) => {
        try {
            dispatch(loading())
            const response = await fetchAuth(`${globalSettings.hostname}/user/info`, {
                method: "PUT", 
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(userInfo)
            })
            let info: UserInfo = await response.json();
            dispatch(setInfo(info))
            dispatch(setNotification({message: msg("Profile info saved :)"), class: "message", time: 2500}))
        } catch (err) {
            dispatch(setNotification({message: msg("Error while saving!"), class: "error", time: 2500}))
        } finally {
            dispatch(doneLoading())
        }
    }
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
                let notification: NotificationInfo = {
                    message: msg("You are not logged in!"),
                    class: "error",
                    time: 2500
                }
                dispatch(setNotification(notification))
            } else if (response.status == 403){
                let notification: NotificationInfo = {message: msg("Not allowed to access this route!"), class: "error", time: 2500}
                dispatch(setNotification(notification))
            } else {
                let notification: NotificationInfo = {message: msg("Unable to login!"), class: "error", time: 2500}
                dispatch(setNotification(notification))
            }
        } catch (err) {
            let notification: NotificationInfo = {message: msg("Unable to login!"), class: "error", time: 2500}
            dispatch(setNotification(notification))
        } finally {
            dispatch(doneLoading())
        }
    }
}



const { login, logout, setInfo, loading, doneLoading } = userSlice.actions

const userReducer = userSlice.reducer

export { userReducer, fetchUserInfo, login, logout, UserInfo, initialUserState, putUserInfo }