import { configureStore } from '@reduxjs/toolkit'
import { testReducer, increment } from './features/test_slice'
import { oauthReducer } from './features/oauth_slice'
import { userReducer } from './features/user_slice'
import { notificationReducer } from "./features/notification_slice"
import { classGroupReducer } from "./features/class_group_slice"
import { savedProgramsReducer } from './features/saved_programs_slice'

const store = configureStore({
    reducer: {
        test: testReducer,
        oauth: oauthReducer,
        user: userReducer,
        notification: notificationReducer,
        classGroup: classGroupReducer,
        savedPrograms: savedProgramsReducer,
    }
})


export { store }