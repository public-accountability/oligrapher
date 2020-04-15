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

export const mountWithStore = (store, component) => mount(
  component,
  {
    wrappingComponent: Provider,
    wrappingComponentProps: { store }
  }
)

export const stubDispatch = () => {
  let mock = sinon.spy()
  sinon.stub(reactRedux, 'useDispatch').returns(mock)
  mock.restore = () => reactRedux['useDispatch'].restore()
  return mock
}

export const stubUseSelector = (state) => {
  let mock = (selector) => selector(state)
  sinon.stub(reactRedux, 'useSelector').returns(mock)
  mock.restore = () => reactRedux['useSelector'].restore()
  return mock
}