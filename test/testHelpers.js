import React from 'react'
import { Provider } from 'react-redux'
import Enzyme from 'enzyme'

import { createOligrapherStore} from '../app/util/render'
import defaultState from '../app/util/defaultState'

export const createMockStore = (state = {}, options = {}) => {
  let store = createOligrapherStore(merge({}, defaultState, state))

  if (options.dispatch) {
    store.dispatch = options.dispatch
  }

  return store
}

export const shallowMountWithStore = (store, children) => Enzyme.shallow(
  React.createElement(Provider,{store: store}, children)
)

export const mountWithStore = (store, children) => Enzyme.mount(
  React.createElement(Provider,{store: store}, children)
)