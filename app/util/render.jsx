import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducers'
import rootSaga from '../sagas'

/*
  Returns an Redux store initialized configured oligrapher state
  See util/configuration for the default values.

  If preloadedState.settings.debug is true, redux's logger is enabled.
*/
export const createOligrapherStore = initialState => {
  const sagaMiddleware = createSagaMiddleware()
  let middleware = [sagaMiddleware]

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

export const withStore = store => WrappedComponent => props => (
  <Provider store={store}>
    <WrappedComponent {...props} />
  </Provider>)

// This is a higher-order component that renders the component into a different
// place in the dom instead of it's normal position in the hierarchy.
// see reactjs.org/docs/portals.html for the docs on Portals.
export function inPortal(Component, id) {
  return props => ReactDOM.createPortal(<Component {...props} />, document.getElementById(id))
}
