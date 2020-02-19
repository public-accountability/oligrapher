import React from 'react'

import { Provider } from 'react-redux'
import { createOligrapherStore } from '../../app/util/render'
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
  let store, useSelectorStub

  beforeEach(function() {
    store = createMockStore()
    // useSelectorStub = sinon.stub(React, "useSelector") // not working/
  })

  // afterEach(function(){
  //   useSelectorStub.restore()
  // })

  it("renders caption-text-input div", function() {
    expect(
      mountWithStore(store, <FloatingMenus />).find('div#caption-text-input').exists()
    ).to.be.ok
  })

  it("shows nothing when there's no open floating menu", () => {
    let state = defaultState
    store = createOligrapherStore(merge({}, state))
    let floatingMenus = mount(<Provider store={store}><FloatingMenus /></Provider>)
    expect(floatingMenus.find(EditNodeMenu)).to.have.lengthOf(0)
    expect(floatingMenus.find(EditEdgeMenu)).to.have.lengthOf(0)
    expect(floatingMenus.find(EditCaptionMenu)).to.have.lengthOf(0)
    expect(floatingMenus.find(AddConnectionsMenu)).to.have.lengthOf(0)
    expect(floatingMenus.find(Settings)).to.have.lengthOf(0)
  })

  it("shows edit edge menu", () => {
    let state = defaultState
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingMenu.set(state, 'edge', edge.id)
    store = createOligrapherStore(merge({}, state))
    let floatingMenus = mount(<Provider store={store}><FloatingMenus /></Provider>)
    expect(floatingMenus.find(EditEdgeMenu)).to.have.lengthOf(1)
  })

  it("hides edit edge menu after edge delete", () => {
    let state = defaultState
    let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    let edge = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(state.graph, [node1, node2])
    Graph.addEdge(state.graph, edge)
    FloatingMenu.set(state, 'edge', edge.id)
    store = createOligrapherStore(merge({}, state))
    let floatingMenus = mount(<Provider store={store}><FloatingMenus /></Provider>)
    expect(floatingMenus.find(EditMenuSubmitButtons)).to.have.lengthOf(1)
    let button = floatingMenus.find("button[name='delete']")
    button.simulate("click")
    expect(floatingMenus.find(EditEdgeMenu)).to.have.lengthOf(0)
  })

  xit("shows edit node menu", function() {
    let floatingMenus = shallowMountWithStore(store, <FloatingMenus />)
    expect(floatingMenus.find(EditNodeMenu)).to.have.lengthOf(1)
  })

  xit("shows edit edge menu", function() {
    expect(floatMenus(state).find(EditNodeMenu)).to.have.lengthOf(0)
    expect(floatMenus(state).find(EditEdgeMenu)).to.have.lengthOf(1)
  })
})
 