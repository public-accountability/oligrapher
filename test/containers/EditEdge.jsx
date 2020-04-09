import React from 'react'
import sinon from 'sinon'
import merge from 'lodash/merge'

import { createMockStore, mountWithStore } from '../testHelpers'
import defaultState from '../../app/util/defaultState'

import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

import EditEdge, { MainPage } from '../../app/containers/EditEdge'
import EditMenu from '../../app/components/editor/EditMenu'
import EditMenuSubmitButtons from '../../app/components/editor/EditMenuSubmitButtons'

import FloatingMenu from '../../app/util/floatingMenu'

import Graph from '../../app/graph/graph'

describe('<EditEdge>', function() {
  let node1, node2, edge, editEdgeMenu, store, state, remover

  beforeEach(function() {
    state = merge({}, defaultState)
    node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    edge = Edge.newEdgeFromNodes(node1, node2)
    FloatingMenu.set(state, 'edge', edge.id)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    remover = sinon.fake()
    store = createMockStore(state, { dispatch: remover })
    editEdgeMenu = mountWithStore(store, <EditEdge />)
  })

  it("renders edit menu component", function() {
    expect(editEdgeMenu.find(EditMenu)).to.have.lengthOf(1)    
  })

  it("renders main edge menu", function() {
    expect(editEdgeMenu.find(MainPage)).to.have.lengthOf(1)
  })

  it("renders submit buttons", function() {
    expect(editEdgeMenu.find(EditMenuSubmitButtons)).to.have.lengthOf(1)
  })

  it("renders a delete button", function() {
    let button = editEdgeMenu.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(remover.calledOnce).to.be.true
    expect(remover.getCall(0).calledWithExactly({ type: "REMOVE_EDGE", id: edge.id })).to.be.true
  })
})