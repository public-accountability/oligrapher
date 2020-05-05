import React from 'react'
import sinon from 'sinon'
import merge from 'lodash/merge'

import { createMockStore, mountWithStore } from '../testHelpers'
import defaultState from '../../app/util/defaultState'

import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

import EdgeEditor, { MainPage } from '../../app/components/EdgeEditor'
import EditorSubmitButtons from '../../app/components/EditorSubmitButtons'

import FloatingEditor from '../../app/util/floatingEditor'

import Graph from '../../app/graph/graph'

describe('<EdgeEditor>', function() {
  let node1, node2, edge, editEdgeMenu, store, state, remover

  beforeEach(function() {
    state = merge({}, defaultState)
    node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    edge = Edge.newEdgeFromNodes(node1, node2)
    FloatingEditor.set(state.display, 'edge', edge.id)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    remover = sinon.fake()
    store = createMockStore(state, { dispatch: remover })
    editEdgeMenu = mountWithStore(store, <EdgeEditor id={edge.id} />)
  })

  it("renders main edge menu", function() {
    expect(editEdgeMenu.find(MainPage)).to.have.lengthOf(1)
  })

  it("renders submit buttons", function() {
    expect(editEdgeMenu.find(EditorSubmitButtons)).to.have.lengthOf(1)
  })

  it("renders a delete button", function() {
    let button = editEdgeMenu.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(remover.calledOnce).to.be.true
    expect(remover.getCall(0).calledWithExactly({ type: "REMOVE_EDGE", id: edge.id })).to.be.true
  })
})