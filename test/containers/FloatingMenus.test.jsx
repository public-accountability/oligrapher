import React from 'react'
import merge from 'lodash/merge'

import { createMockStore, mountWithStore } from '../testHelpers'
import defaultState from '../../app/util/defaultState'

import FloatingMenus from '../../app/containers/FloatingMenus'
import EditNodeMenu from '../../app/containers/EditNodeMenu'
import EditEdgeMenu from '../../app/containers/EditEdgeMenu'
import AddConnectionsMenu from '../../app/containers/AddConnectionsMenu'
import EditCaptionMenu from '../../app/containers/EditCaptionMenu'
import Settings from '../../app/containers/Settings'
import EditMenuSubmitButtons from '../../app/components/editor/EditMenuSubmitButtons'

import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'
import FloatingMenu from '../../app/util/floatingMenu'

describe('<FloatingMenus>', function() {
  let state, store, wrapper

  beforeEach(function() {
    state = merge({}, defaultState)
  })

  it("renders caption-text-input div", function() {
    store = createMockStore()
    expect(
      mountWithStore(store, <FloatingMenus />).find('div#caption-text-input').exists()
    ).to.be.ok
  })

  it("shows nothing when there's no open floating menu", function() {
    store = createMockStore()
    wrapper = mountWithStore(store, <FloatingMenus />)
    expect(wrapper.find(EditNodeMenu)).to.have.lengthOf(0)
    expect(wrapper.find(EditEdgeMenu)).to.have.lengthOf(0)
    expect(wrapper.find(EditCaptionMenu)).to.have.lengthOf(0)
    expect(wrapper.find(AddConnectionsMenu)).to.have.lengthOf(0)
    expect(wrapper.find(Settings)).to.have.lengthOf(0)
  })

  it("shows edit edge menu", function() {
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingMenu.set(state, 'edge', edge.id)
    store = createMockStore(state)
    wrapper = mountWithStore(store, <FloatingMenus />)
    expect(wrapper.find(EditEdgeMenu)).to.have.lengthOf(1)
  })

  it("hides edit edge menu after edge delete", function() {
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingMenu.set(state, 'edge', edge.id)
    store = createMockStore(state)
    wrapper = mountWithStore(store, <FloatingMenus />)
    expect(wrapper.find(EditMenuSubmitButtons)).to.have.lengthOf(1)
    let button = wrapper.find("button[name='delete']")
    button.simulate("click")
    expect(wrapper.find(EditEdgeMenu)).to.have.lengthOf(0)
  })
})