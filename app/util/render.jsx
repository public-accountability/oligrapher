import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import reducers from '../reducers'
import Root from '../containers/Root'

/*
  Returns an Redux store initialized configured oligrapher state
  See util/configuration for the default values.

  If preloadedState.settings.debug is true, redux's logger is enabled.
*/
export const createOligrapherStore = preloadedState => {
  let middleware = [thunk]

  if (preloadedState.settings.debug) {
    middleware.push(createLogger())
  }

  return createStore(reducers,
                     preloadedState,
                     applyMiddleware(...middleware))
}

export const renderNewApplication = (store, element) => {
  const application = <Provider store={store}>
                        <Root />
                      </Provider>

  ReactDOM.render(application, element)
}
