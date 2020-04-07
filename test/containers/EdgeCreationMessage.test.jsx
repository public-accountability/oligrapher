import React from 'react'
import { EdgeCreationMessage } from '../../app/containers/EdgeCreationMessage'
import Node from '../../app/graph/node'

describe('<EdgeCreationMessage>', function() {
  let props, wrapper

  it('renders nothing when no edge creation nodes', function() {
    props = {
      hoveringNode: null,
      hoveredNode: null
    }
    wrapper = shallow(<EdgeCreationMessage {...props} />)
    expect(wrapper.find('.oligrapher-edge-creation-message')).to.have.lengthOf(0)
  })

  it('renders message containing node names', function() {
    props = {
      hoveringNode: Node.new({ name: "bob" }),
      hoveredNode: Node.new({ name: "larry" })
    }
    wrapper = shallow(<EdgeCreationMessage {...props} />)
    let message = wrapper.find('.oligrapher-edge-creation-message')
    expect(message).to.have.lengthOf(1)
    expect(message.text()).to.contain(props.hoveringNode.name)
    expect(message.text()).to.contain(props.hoveredNode.name)
  })
})