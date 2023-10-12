import { configureStore } from '@reduxjs/toolkit'
import { oauthReducer } from './features/oauth_slice'
import { userReducer } from './features/user_slice'
import { notificationReducer } from "./features/notification_slice"
import { classGroupReducer } from "./features/class_group_slice"
import { savedStatesReducer } from './features/saved_state_slice'
import { studentClassGroupReducer } from "./features/student_class_group_slice"
import { publicProfileInfoReducer } from './features/public_profile_slice'
import { assignmentGroupReducer } from "./features/assignment_group_slice"
import { portfolioReducer } from "./features/portfolio_slice"
import { contentReducer } from './features/content_slice'
import { activeLearningPathReducer } from './features/learning_path_progress_slice'

const store = configureStore({
    reducer: {
        oauth: oauthReducer,
        user: userReducer,
        notification: notificationReducer,
        classGroup: classGroupReducer,
        savedStates: savedStatesReducer,
        studentClassGroup: studentClassGroupReducer,
        publicProfile: publicProfileInfoReducer, 
        assignments: assignmentGroupReducer,
        portfolio: portfolioReducer,
        content: contentReducer,
        activeLearningPath: activeLearningPathReducer,
    }
})


export { store }