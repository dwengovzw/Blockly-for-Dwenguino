import { configureStore } from '@reduxjs/toolkit'
import testReducer from './reducers/test_reducer'

const store = configureStore({
    reducer: testReducer
})

// You can only update the store using the dispatch method
// Kind of like triggering an event
store.dispatch({type: 'counter/increment'})

// Can be abstracted in a function
const increment = () => {
    return {
      type: 'counter/increment'
    }
  }

store.dispatch(increment());

// Selectors can be used to extract more complex information from the store
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())

export default store