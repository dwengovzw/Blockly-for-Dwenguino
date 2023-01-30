import { createSlice } from "@reduxjs/toolkit"

export const oauthSlice = createSlice({
    name: "oauth",
    initialState: {
        platforms: ["apple", "google", "microsoft"]
    }, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        update: (state, action) => {
            state.platforms = action.payload
        },
        addPlatform: (state, action) =>{
            state.platforms.push(action.payload)
        }

    }
})

// the outside thunk creator function
const fetchPlatforms = () => {
    // The inside thunk function
    return async (dispatch: any, getState: any) => {
        try {
            // make async call
            let response = await fetch("/oauth/platforms")
            if (response.status == 200){
                dispatch(update(await response.json()))
            } 
        } catch (err) {
            console.error(err)
        }
    }
}


const { update, addPlatform } = oauthSlice.actions

const oauthReducer = oauthSlice.reducer

export { oauthReducer, update, addPlatform, fetchPlatforms }