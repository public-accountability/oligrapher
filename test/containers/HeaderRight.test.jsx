import React from 'react'
import sinon from 'sinon'

import HeaderRight from '../../app/containers/HeaderRight'
import HeaderMenu from '../../app/components/HeaderMenu'
import HeaderButtons from '../../app/containers/HeaderButtons'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<HeaderRight>', function() {
  let store, wrapper

  it("shows HeaderMenu when not in editor mode", function() {
    store = createMockStore({
      display: { modes: { editor: false } }
    })
    wrapper = mountWithStore(store, <HeaderRight />)

    expect(wrapper.find(HeaderMenu)).to.have.lengthOf(1)
    expect(wrapper.find(HeaderButtons)).to.have.lengthOf(0)

  })

  it("shows HeaderButtons in editor mode", function() {
    store = createMockStore({
      display: { modes: { editor: true } }
    })
    wrapper = mountWithStore(store, <HeaderRight />)

    expect(wrapper.find(HeaderMenu)).to.have.lengthOf(0)
    expect(wrapper.find(HeaderButtons)).to.have.lengthOf(1)
  })
})
