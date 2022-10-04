import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
//import undoable from 'redux-undo';
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducer'
import rootSaga from '../sagas'
import { State } from './defaultState'
import stateInitializer from './stateInitializer'

// Creates an Redux store configured with default values
// also see util/defaultState and util/stateInitializer
export default function createOligrapherStore(configuration = {}): EnhancedStore<State> {
  const initialState = stateInitializer(configuration)
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: createReducer(initialState, reducer),
    middleware: (getDefaultMiddleware) => {
      let m = getDefaultMiddleware().concat(sagaMiddleware)
      if (initialState.settings.logActions) {
        m.push(logger)
      }
      return m
    }
  })

  sagaMiddleware.run(rootSaga)

  return store
}
