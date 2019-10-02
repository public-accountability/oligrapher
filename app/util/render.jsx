import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from '../reducers'
import Root from '../containers/Root'


export const storeWithMiddleware = (logActions = false) => {
  let middleWare = [thunk].concat(logActions ? [createLogger()] : [])
  return applyMiddleware(...middleWare)(createStore)(reducers);
}

export const createApplication = store => (
    <Provider store={store}>
      <Root />
    </Provider>
)

export const renderNewApplication = (store, element) => {
  ReactDOM.render(createApplication(store), element);
}
