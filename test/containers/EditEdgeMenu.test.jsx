import React from 'react'

import { Provider } from 'react-redux'
import { createOligrapherStore } from '../../app/util/render'
import defaultState from '../../app/util/defaultState'

import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

import EditEdgeMenu, { MainPage } from '../../app/containers/EditEdgeMenu'
import EditMenu from '../../app/components/editor/EditMenu'
import EditMenuSubmitButtons from '../../app/components/editor/EditMenuSubmitButtons'

import FloatingMenu from '../../app/util/floatingMenu'

import { mount } from 'enzyme'
import Graph from '../../app/graph/graph'

describe('<EditEdgeMenu>', function() {
  let node1, node2, edge, props, store, editEdgeMenu, remover

  beforeEach(() => {
    node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    edge = Edge.newEdgeFromNodes(node1, node2)
    remover = sinon.fake()
    props = { 
      edge, 
      id: edge.id, 
      nodes: [node1, node2]
    }
    let state = defaultState
    FloatingMenu.set(state, 'edge', edge.id)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    let store = createOligrapherStore(merge({}, state))
    editEdgeMenu = mount(<Provider store={store}><EditEdgeMenu {...props} /></Provider>)
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
  })
})