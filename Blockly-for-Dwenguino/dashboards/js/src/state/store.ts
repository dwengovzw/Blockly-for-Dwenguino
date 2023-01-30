import { configureStore } from '@reduxjs/toolkit'
import { testReducer, increment } from './features/test_slice'
import { oauthReducer } from './features/oauth_slice'

const store = configureStore({
    reducer: {
        test: testReducer,
        oauth: oauthReducer
    }
})

// You can only update the store using the dispatch method
// Kind of like triggering an event
store.dispatch({type: 'counter/increment'})

store.dispatch(increment());

// Selectors can be used to extract more complex information from the store
const selectCounterValue = (state:any) => state.value

const currentValue = selectCounterValue(store.getState())

export { store }