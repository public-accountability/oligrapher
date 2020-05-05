import React from 'react'

import { createMockStore, mountWithStore } from '../testHelpers'
import DraggableComponent from '../../app/components/DraggableComponent'
import { Node } from '../../app/components/Node'
import NodeHalo from '../../app/components/NodeHalo'
import NodeCircle from '../../app/components/NodeCircle'
import NodeImage from '../../app/components/NodeImage'

describe('<Node>', function() {
  let wrapper, node, state, store

  beforeEach(function() {
    node = {
      id: 'abc',
      x: 1,
      y: 2,
      name: 'Example',
      url: null,
      color: '#CCC',
      status: 'normal',
      scale: 2,
      image: 'http://example.com'
    }
    state = { 
      graph: { nodes: { 'abc': node } },
      display: { modes: { editor: true } } 
    }
    store = createMockStore(state)
    wrapper = mountWithStore(store, <svg><Node id={node.id} currentlyEdited={false} /></svg>)
  })

  it('renders Draggable', function() {
    expect(wrapper.find(DraggableComponent)).to.have.lengthOf(1)
  })

  it("renders <g> with id and class", function() {
    expect(wrapper.find('g').first().prop('id')).to.eql("node-abc")
    expect(wrapper.find('g').first().hasClass('oligrapher-node')).to.be.ok
  })

  it('renders <NodeHalo>', function() {
    expect(wrapper.find(NodeHalo)).to.have.lengthOf(1)
  })

  it('renders <NodeCircle>', function() {
    expect(wrapper.find(NodeCircle)).to.have.lengthOf(1)
  })

  it('render <NodeImage>', function() {
    expect(wrapper.find(NodeImage)).to.have.lengthOf(1)
  })
})
