import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import initialState from './initialState/index'
import rootReducer from './reducers/index'

export const composeEnhancers = window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

function configureStore() {
  return createStore(rootReducer, initialState, composeWithDevTools())
}

const store = configureStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
