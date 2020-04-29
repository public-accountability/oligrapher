import React from 'react'

import EdgeCreationMessage from '../../app/containers/EdgeCreationMessage'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<EdgeCreationMessage>', function() {
  let store, wrapper
  
  it('renders nothing when no edge creation nodes', function() {
    store = createMockStore({ 
      graph: { nodes: { } },
      edgeCreation: { nodes: {
        hoveringNode: null,
        hoveredNode: null
      } }
    })
    wrapper = mountWithStore(store, <EdgeCreationMessage />)
    expect(wrapper.find('.oligrapher-edge-creation-message')).to.have.lengthOf(0)
  })

  it('renders message containing node names', function() {
    store = createMockStore({ 
      graph: { nodes: { 
        "1": { id: "1", name: "bob" },
        "2": { id: "2", name: "bozo" } 
      } },
      edgeCreation: { nodes: ["1", "2"] }
    })
    wrapper = mountWithStore(store, <EdgeCreationMessage />)
    let message = wrapper.find('.oligrapher-edge-creation-message')
    expect(message).to.have.lengthOf(1)
    expect(message.text()).to.contain("bob")
    expect(message.text()).to.contain("bozo")
  })
})