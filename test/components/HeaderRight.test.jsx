import React from 'react'

import HeaderRight from '../../app/components/HeaderRight'
import HeaderActions from '../../app/components/HeaderActions'
import HeaderEditActions from '../../app/components/HeaderEditActions'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<HeaderRight>', function() {
  let store, wrapper

  it("shows HeaderMenu when not in editor mode", function() {
    store = createMockStore({
      display: { modes: { editor: false } }
    })
    wrapper = mountWithStore(store, <HeaderRight />)

    expect(wrapper.find(HeaderActions)).to.have.lengthOf(1)
    expect(wrapper.find(HeaderEditActions)).to.have.lengthOf(0)

  })

  it("shows HeaderButtons in editor mode", function() {
    store = createMockStore({
      display: { modes: { editor: true } },
      attributes: {
        user: { id: "1", name: "Bob" },
        owner: { id: "1", name: "Bob" }
      }
    })
    wrapper = mountWithStore(store, <HeaderRight />)

    expect(wrapper.find(HeaderActions)).to.have.lengthOf(0)
    expect(wrapper.find(HeaderEditActions)).to.have.lengthOf(1)
  })
})
