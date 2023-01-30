import { createSlice } from "@reduxjs/toolkit"

export const testSlice = createSlice({
    name: "test",
    initialState: {
        value: 0
    }, 
    /* In these functions you can use mutating logic since the createSlice
    function uses Immer to make sure the logic your write will be immutable.*/
    reducers: {
        increment: (state: any) => {
            state.value += 1
        },
        decrement: (state: any) => {
            state.value -= 1
        },
        incrementByAmount: (state: any, action: any) => {
            state.value += action.payload
        }
    }
})


const { increment, decrement, incrementByAmount } = testSlice.actions

const testReducer = testSlice.reducer

export { testReducer, increment, decrement, incrementByAmount }