import { createStore, applyMiddleware, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import { StateWithHistory } from './defaultState'
import reducers from '../reducers'
import rootSaga from '../sagas'

/*
  Returns an Redux store initialized configured oligrapher state
  See util/configuration for the default values.

  If preloadedState.settings.debug is true, redux's logger is enabled.
*/
export const createOligrapherStore = (initialState: StateWithHistory) => {
  const sagaMiddleware = createSagaMiddleware()
  let middleware: Middleware[] = [sagaMiddleware]

  if (initialState.settings.debug) {
    middleware.push(createLogger())
  }

  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(...middleware)
  )

  sagaMiddleware.run(rootSaga)

  return store
}