import { configureStore } from '@reduxjs/toolkit'
import { editorStateReducer } from './features/editor_state_slice'
import { notificationReducer } from '../../../../dashboards/js/src/state/features/notification_slice'

const store = configureStore({
    reducer: {
        editorState: editorStateReducer,
        notification: notificationReducer,
    }
})

export { store }