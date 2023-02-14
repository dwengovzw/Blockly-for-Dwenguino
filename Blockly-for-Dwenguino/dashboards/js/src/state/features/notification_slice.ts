import { createSlice } from "@reduxjs/toolkit"

interface NotificationInfo {
    message: string,
    class: string,
    visible?: boolean,
    time: number
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        message: "",
        class: "message",
        visible: false,
        time: 5000
    },
    reducers: {
        setNotification: (state, action) => {
            state.message = action.payload.message
            state.class = action.payload.class
            state.visible = true,
            state.time = action.payload.time
        },
        hide: (state) => {
            state.visible = false;
        }
    }
})

const { setNotification, hide } = notificationSlice.actions
const notificationReducer = notificationSlice.reducer

export { notificationReducer, NotificationInfo, setNotification, hide }