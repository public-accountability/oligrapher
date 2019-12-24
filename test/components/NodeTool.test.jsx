import React from 'react'
import { Provider } from 'react-redux'
import NodeTool from '../../app/components/tools/Node'

describe.only('<NodeTool>', function() {
  let wrapper, mockStore

  beforeEach(function() {
    mockStore = createMockStore()
    wrapper = mount(<Provider store={mockStore}>
                      <NodeTool />
                    </Provider>)
  })

  it('renders components', function() {
    ['input', 'div.nodetool', 'a'].forEach( selector => {
      expect(wrapper.find(selector)).to.have.lengthOf(1)
    })
  })

  it('search database for results')
})
