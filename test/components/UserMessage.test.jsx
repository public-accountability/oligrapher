import React from 'react'

import UserMessage from '../../app/components/UserMessage'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<UserMessage>', function() {
  let store, wrapper
  
  it('renders nothing when no message', function() {
    store = createMockStore({ 
      display: { userMessage: null }
    })
    wrapper = mountWithStore(store, <UserMessage />)
    expect(wrapper.find('.oligrapher-user-message')).to.have.lengthOf(0)
  })

  it('renders message containing node names', function() {
    store = createMockStore({ 
      display: { userMessage: "stay home and stay safe" }
    })
    wrapper = mountWithStore(store, <UserMessage />)
    let message = wrapper.find('.oligrapher-user-message')
    expect(message.text()).to.equal("stay home and stay safe")
  })
})