import React from 'react'
import Draggable from 'react-draggable'
import { Node } from '../../app/containers/Node'
import NodeCircle from '../../app/components/graph/NodeCircle'

describe('<Node>', function() {
  let node

  beforeEach(function() {
    let props = {
      id: 'abc',
      x: 1,
      y: 2,
      scale: 1,
      name: 'Example',
      url: null,
      color: '#CCC',
      status: 'normal'
    }
    node = shallow(<Node {...props} />)
  })

  xit('renders Draggable', function() {
    expect(node.find(Draggable)).to.have.lengthOf(1)
  })

  it("renders <g> with id and class", function() {
    expect(node.find('g').first().prop('id')).to.eql("node-abc")
    expect(node.find('g').first().hasClass('oligrapher-node')).to.be.ok
  })

  it('renders <NodeCircle>', function() {
    expect(node.find(NodeCircle)).to.have.lengthOf(1)
  })
})
