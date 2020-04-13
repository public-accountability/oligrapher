import React from 'react'
import DraggableComponent from '../../app/components/graph/DraggableComponent'
import { Node } from '../../app/containers/Node'
import NodeCircle from '../../app/components/graph/NodeCircle'
import NodeImage from '../../app/components/graph/NodeImage'
import sinon from 'sinon'

describe('<Node>', function() {
  let props, node, toggle, move, drag

  beforeEach(function() {
    toggle = sinon.spy()
    move = sinon.spy()
    drag = sinon.spy()
    props = {
      id: 'abc',
      x: 1,
      y: 2,
      radius: 25,
      name: 'Example',
      url: null,
      color: '#CCC',
      status: 'normal',
      image: 'http://example.com',
      editorMode: true,
      toggleEditNodeMenu: toggle,
      dragNode: drag,
      moveNode: move
    }
    node = shallow(<Node {...props} />)
  })

  it('renders Draggable', function() {
    expect(node.find(DraggableComponent)).to.have.lengthOf(1)
  })

  it("renders <g> with id and class", function() {
    expect(node.find('g').first().prop('id')).to.eql("node-abc")
    expect(node.find('g').first().hasClass('oligrapher-node')).to.be.ok
  })

  it('renders <NodeCircle>', function() {
    expect(node.find(NodeCircle)).to.have.lengthOf(1)
  })

  it('render <NodeImage>', function() {
    expect(node.find(NodeImage)).to.have.lengthOf(1)
  })

  it('toggles edit node menu when clicked', function() {
    node.find(DraggableComponent).simulate('click')
    expect(toggle.callCount).to.equal(1)
    expect(drag.callCount).to.equal(0)
    expect(move.callCount).to.equal(0)
  })

  it('disabled clicking and dragging when not in editor mode', function() {
    props.editorMode = false
    node = shallow(<Node {...props} />)
    node.find(DraggableComponent).simulate('click')
    expect(node.find(DraggableComponent).prop('disabled')).to.be.true
    expect(toggle.callCount).to.equal(0)
  })
})
