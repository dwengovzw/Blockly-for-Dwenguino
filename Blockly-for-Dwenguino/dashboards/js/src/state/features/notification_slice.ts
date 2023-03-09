import { createSlice } from "@reduxjs/toolkit"
import { msg } from "@lit/localize"

interface NotificationInfo {
    message: string,
    class: string,
    visible?: boolean
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        message: "",
        class: "message",
        visible: false,
        loading: false
    },
    reducers: {
        setNotification: (state, action) => {
            state.message = action.payload.message
            state.class = action.payload.class
            state.visible = true
        },
        hide: (state) => {
            state.visible = false;
        },
        loading: (state) => {
            state.loading = true
        },
        doneLoading: (state) => {
            state.loading = false
        },
    }
})

enum NotificationMessageType {
    MESSAGE = "message", 
    ERROR = "error"
}

const setNotificationMessage = (message: string, type: NotificationMessageType, time: number = 5000) => {
    return async (dispatch, getState) => {
        dispatch(setNotification({message: message, class: type, time: time}))
        setTimeout(() => {
            dispatch(hide())
        }, time)
    }
}

const { setNotification, hide, loading, doneLoading } = notificationSlice.actions
const notificationReducer = notificationSlice.reducer

export { notificationReducer, NotificationInfo, NotificationMessageType, setNotificationMessage, loading, doneLoading }