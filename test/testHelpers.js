import React from 'react'
import { Provider } from 'react-redux'
import { shallow, mount } from 'enzyme'

import { createOligrapherStore } from '../app/util/render'
import defaultState from '../app/util/defaultState'

import sinon from "sinon"
import * as reactRedux from "react-redux"

export const createMockStore = (state = {}, options = {}) => {
  let store = createOligrapherStore(merge({}, defaultState, state))

  if (options.dispatch) {
    store.dispatch = options.dispatch
  }

  return store
}

export const shallowMountWithStore = (store, children) => shallow(
  React.createElement(Provider, {store: store}, children)
)

export const mountWithStore = (store, children) => mount(
  React.createElement(Provider, {store: store}, children)
)

export const mockReactReduxHook = (hookName) => {
  let mock = sinon.spy()
  sinon.stub(reactRedux, hookName).returns(mock)
  mock.restore = () => reactRedux[hookName].restore()
  return mock
}

export const stubDispatch = () => {
  return mockReactReduxHook('useDispatch')
}

export const stubUseSelector = () => {
  return mockReactReduxHook('useSelector')
}