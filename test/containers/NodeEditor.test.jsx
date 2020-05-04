import React from 'react'
import sinon from 'sinon'

import EditNode, { MainPage } from '../../app/containers/EditNode'
import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import EditNodeColorPage from '../../app/components/editor/EditNodeColorPage'
import SizePicker from '../../app/components/SizePicker'
import { stubDispatch, createMockStore, mountWithStore } from '../testHelpers'

describe('<EditNode>', function() {
  let node, graph, store, editNode, mockDispatch

  beforeEach(function() {
    mockDispatch = stubDispatch()
    node = Node.new({ id: "1", name: 'Corporation', url: 'https://example.com' })
    graph = Graph.new()
    Graph.addNode(graph, node)
    store = createMockStore({ graph })
    editNode = mountWithStore(
      store, 
      <EditNode id={node.id} />
    )
  })

  afterEach(function() {
    mockDispatch.restore()
  })

  it("starts with main page", function() {
    expect(editNode.find(MainPage)).to.have.lengthOf(1)
    expect(editNode.find(EditNodeColorPage)).to.have.lengthOf(0)
  })

  it("switches to color page", function() {
    let colorIcon = editNode.find('.entity-color-icon')
    colorIcon.simulate("click")
    expect(editNode.find(MainPage)).to.have.lengthOf(0)
    expect(editNode.find(EditNodeColorPage)).to.have.lengthOf(1)
  })

  it("switches to size page", function() {
    let sizeIcon = editNode.find('.entity-size-icon')
    sizeIcon.simulate("click")
    expect(editNode.find(MainPage)).to.have.lengthOf(0)
    expect(editNode.find(SizePicker)).to.have.lengthOf(1)
  })

  it("shows add connections link which triggers open add connections", function() {
    let link = editNode.find('.add-connections-link')
    link.simulate("click")
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0].type).to.equal('OPEN_ADD_CONNECTIONS')
  })

  it("shows delete button which removes node", function() {
    let button = editNode.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'REMOVE_NODE', id: node.id })
  })

  it("updates node name", function() {
    let input = editNode.find('input').at(0)
    input.simulate("change", { target: { value: 'Corp' }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { name: 'Corp' }})
  })

  it("updates node image", function() {
    let input = editNode.find('input').at(1)
    let image = 'https://example.com/image.png'
    input.simulate("change", { target: { value: image }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { image }})
  })

  it("updates node url", function() {
    let input = editNode.find('input').at(2)
    let url = 'https://example.co'
    input.simulate("change", { target: { value: url }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { url }})
  })
})
