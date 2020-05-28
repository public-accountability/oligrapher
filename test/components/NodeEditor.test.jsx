import React from 'react'

import NodeEditor, { MainPage } from '../../app/components/NodeEditor'
import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import EditNodeColorPage from '../../app/components/EditNodeColorPage'
import SizePicker from '../../app/components/SizePicker'
import { stubDispatch, createMockStore, mountWithStore } from '../testHelpers'

describe('<NodeEditor>', function() {
  let node, graph, store, nodeEditor, mockDispatch

  beforeEach(function() {
    mockDispatch = stubDispatch()
    node = Node.new({ id: "1", name: 'Corporation', url: 'https://example.com' })
    graph = Graph.new()
    Graph.addNode(graph, node)
    store = createMockStore({ graph })
    nodeEditor = mountWithStore(
      store, 
      <NodeEditor id={node.id} />
    )
  })

  afterEach(function() {
    mockDispatch.restore()
  })

  it("starts with main page", function() {
    expect(nodeEditor.find(MainPage)).to.have.lengthOf(1)
    expect(nodeEditor.find(EditNodeColorPage)).to.have.lengthOf(0)
  })

  it("switches to color page", function() {
    let colorIcon = nodeEditor.find('.entity-color-icon')
    colorIcon.simulate("click")
    expect(nodeEditor.find(MainPage)).to.have.lengthOf(0)
    expect(nodeEditor.find(EditNodeColorPage)).to.have.lengthOf(1)
  })

  it("switches to size page", function() {
    let sizeIcon = nodeEditor.find('.entity-size-icon')
    sizeIcon.simulate("click")
    expect(nodeEditor.find(MainPage)).to.have.lengthOf(0)
    expect(nodeEditor.find(SizePicker)).to.have.lengthOf(1)
  })

  it("shows add connections link which triggers open add connections", function() {
    let link = nodeEditor.find('.add-connections-link')
    link.simulate("click")
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0].type).to.equal('OPEN_ADD_CONNECTIONS')
  })

  it("shows delete button which removes node", function() {
    let button = nodeEditor.find("footer button")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'REMOVE_NODE', id: node.id })
  })

  it("updates node name", function() {
    let input = nodeEditor.find('input').at(0)
    input.simulate("change", { target: { value: 'Corp' }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { name: 'Corp' }})
  })

  it("updates node image", function() {
    let input = nodeEditor.find('input').at(1)
    let image = 'https://example.com/image.png'
    input.simulate("change", { target: { value: image }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { image }})
  })

  it("updates node url", function() {
    let input = nodeEditor.find('input').at(2)
    let url = 'https://example.co'
    input.simulate("change", { target: { value: url }})
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'UPDATE_NODE', id: node.id, attributes: { url }})
  })
})
