import { configureStore, createReducer, Middleware } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducer'
import rootSaga from '../sagas'
import stateInitializer from './stateInitializer'

// Creates an Redux store configured with default values
// also see util/defaultState and util/stateInitializer
export default function createOligrapherStore(configuration = {}) {
  const initialState = stateInitializer(configuration)
  const sagaMiddleware = createSagaMiddleware()
  let middleware: Middleware[] = [sagaMiddleware]

  if (initialState.settings.debug) {
    middleware.push(createLogger())
  }

  const store = configureStore({
    reducer: createReducer(initialState, reducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middleware)
  })

  sagaMiddleware.run(rootSaga)

  return store
}
