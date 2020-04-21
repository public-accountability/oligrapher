import React from 'react'
import DraggableComponent from '../../app/components/graph/DraggableComponent'
import { Node } from '../../app/containers/Node'
import NodeHalo from '../../app/components/graph/NodeHalo'
import NodeCircle from '../../app/components/graph/NodeCircle'
import NodeImage from '../../app/components/graph/NodeImage'
import sinon from 'sinon'

describe('<Node>', function() {
  let props, node, click, move, drag

  beforeEach(function() {
    click = sinon.spy()
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
      clickNode: click,
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

  it('renders <NodeHalo> only if being edited', function() {
    expect(node.find(NodeHalo)).to.have.lengthOf(0)
    props.isBeingEdited = true
    node.setProps(props)
    expect(node.find(NodeHalo)).to.have.lengthOf(1)
  })

  it('renders <NodeCircle>', function() {
    expect(node.find(NodeCircle)).to.have.lengthOf(1)
  })

  it('render <NodeImage>', function() {
    expect(node.find(NodeImage)).to.have.lengthOf(1)
  })

  it('handles click', function() {
    node.find(DraggableComponent).simulate('click')
    expect(click.callCount).to.equal(1)
    expect(drag.callCount).to.equal(0)
    expect(move.callCount).to.equal(0)
  })

  it('disabled clicking and dragging when not in editor mode', function() {
    props.editorMode = false
    node = shallow(<Node {...props} />)
    expect(node.find(DraggableComponent).prop('disabled')).to.be.true
  })
})
