import React from 'react'
import { createMockStore, mountWithStore } from '../testHelpers'
import NodeTool from '../../app/components/tools/Node'

describe('<NodeTool>', function() {
  let wrapper, mockStore

  beforeEach(function() {
    mockStore = createMockStore()
    wrapper = mountWithStore(mockStore, <NodeTool />)
  })

  it('renders components', function() {
    ['input', 'div.nodetool', 'a'].forEach( selector => {
      expect(wrapper.find(selector)).to.have.lengthOf(1)
    })
  })
})