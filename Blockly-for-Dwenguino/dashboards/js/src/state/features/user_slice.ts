import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false
    }, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        login: (state: any) => {
            state.isLoggedIn = true
        },
        logout: (state: any) => {
            state.isLoggedIn = false
        },

    }
})

// the outside thunk creator function
const fetchUserLoggedIn = userId => {
    // The inside thunk function
    return async (dispatch: any, getState: any) => {
        try {
            // make async call
            let response = await fetch("/user/isLoggedIn")
            if (response.status == 200){
                dispatch(login())
            } else { 
                dispatch(logout())
            }
        } catch (err) {
            console.error(err)
            dispatch(logout())
        }
    }
}


const { login, logout } = userSlice.actions

const userReducer = userSlice.reducer

export { userReducer, fetchUserLoggedIn, login, logout }