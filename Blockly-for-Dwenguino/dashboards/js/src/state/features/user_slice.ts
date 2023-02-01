import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { state } from "lit/decorators"
import { setNotification, NotificationInfo } from "./notification_slice"


interface UserInfo {
    loggedIn: boolean,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: Date,
    roles: string[]
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedIn: false,
        firstname: "",
        lastname: "",
        email: "",
        birthdate: null,
        roles: []
    }, 
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
            state.roles = action.payload.roles
        }

    }
})

const fetchUserInfo = () => {
    // The inside thunk function
    return async (dispatch: any, getState: any) => {
        try {
            // make async call
            let response = await fetch("/user/info")
            if (response.status == 200){
                let info: UserInfo = await response.json();
                dispatch(setInfo(info))
                let notification: NotificationInfo = {
                    message: msg("Login successful"),
                    class: "message",
                    time: 2500
                }
                dispatch(setNotification(notification))
            } else if (response.status == 401){ 
                // Unauthorized => logout
                dispatch(logout())
                let notification: NotificationInfo = {
                    message: msg("You are not logged in!"),
                    class: "error",
                    time: 2500
                }
                dispatch(setNotification(notification))
            } else {
                // no state change 
                // TODO: notify users when they acces a restricted route (403)
                // TODO: notify users when error occurs
                let notification: NotificationInfo = {
                    message: msg("Unable to login!"),
                    class: "error",
                    time: 2500
                }
                dispatch(setNotification(notification))
            }
        } catch (err) {
            console.error(err)
        }
    }
}



const { login, logout, setInfo } = userSlice.actions

const userReducer = userSlice.reducer

export { userReducer, fetchUserInfo, login, logout }