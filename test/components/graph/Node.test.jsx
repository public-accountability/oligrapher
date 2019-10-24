import React from 'react'
import Draggable from 'react-draggable'
import NodeModel from '../../../app/models/Node'

import { newNode } from '../../../app/graph/node'
import Node from '../../../app/components/graph/Node'
import NodeCircle from '../../../app/components/graph/NodeCircle'

describe('<Node>', function() {
  let nodeData = newNode({dislay: {x: 1, y: 2}})

  xit('renders Draggable', function() {
    let node = shallow(<Node node={nodeData} />)
    expect(node.find(Draggable)).to.have.lengthOf(1)
  })

  it("renders <g> with id and class", function() {
    let node = shallow(<Node node={nodeData} />)
    expect(node.find('g').first().prop('id')).to.eql(`node-${nodeData.id}`)
    expect(node.find('g').first().hasClass('oligrapher-node')).to.be.ok
  })

  it('renders <NodeCircle>', function() {
    let node = shallow(<Node node={nodeData} />)
    expect(node.find(NodeCircle)).to.have.lengthOf(1)
  })

})
