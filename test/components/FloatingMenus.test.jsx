import React from 'react'
import merge from 'lodash/merge'

import { createMockStore, mountWithStore } from '../testHelpers'
import defaultState from '../../app/util/defaultState'

import FloatingEditors from '../../app/components/FloatingEditors'
import NodeEditor from '../../app/components/NodeEditor'
import EdgeEditor from '../../app/components/EdgeEditor'
import AddConnections from '../../app/components/AddConnections'
import CaptionEditor from '../../app/components/CaptionEditor'
import EditorSubmitButtons from '../../app/components/EditorSubmitButtons'

import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'
import FloatingEditor from '../../app/util/floatingEditor'

describe('<FloatingEditors>', function() {
  let state, store, wrapper

  beforeEach(function() {
    state = merge({}, defaultState, { display: { modes: { editor: true } } })
  })
  
  it("shows nothing when not in editor mode", function() {
    state.display.modes.editor = false
    store = createMockStore(state)
    wrapper = mountWithStore(store, <FloatingEditors />)
    expect(wrapper.html()).to.be.null
  })

  it("shows nothing when there's no open floating menu", function() {
    store = createMockStore()
    wrapper = mountWithStore(store, <FloatingEditors />)
    expect(wrapper.find(NodeEditor)).to.have.lengthOf(0)
    expect(wrapper.find(EdgeEditor)).to.have.lengthOf(0)
    expect(wrapper.find(CaptionEditor)).to.have.lengthOf(0)
    expect(wrapper.find(AddConnections)).to.have.lengthOf(0)
  })

  it("shows edit edge menu", function() {
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingEditor.set(state.display, 'edge', edge.id, { x: 0, y: 0 })
    store = createMockStore(state)
    wrapper = mountWithStore(store, <FloatingEditors />)
    expect(wrapper.find(EdgeEditor)).to.have.lengthOf(1)
  })

  it("hides edit edge menu after edge delete", function() {
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingEditor.set(state.display, 'edge', edge.id)
    store = createMockStore(state)
    wrapper = mountWithStore(store, <FloatingEditors />)
    expect(wrapper.find(EditorSubmitButtons)).to.have.lengthOf(1)
    let button = wrapper.find("button[name='delete']")
    button.simulate("click")
    expect(wrapper.find(EdgeEditor)).to.have.lengthOf(0)
  })
})