import React from 'react'

import { Provider } from 'react-redux'
import { createOligrapherStore } from '../../app/util/render'
import defaultState from '../../app/util/defaultState'

import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

import { MainPage, EditEdgeMenu } from '../../app/containers/EditEdgeMenu'
import EditMenu from '../../app/components/editor/EditMenu'
import EditMenuSubmitButtons from '../../app/components/editor/EditMenuSubmitButtons'

describe('<EditEdgeMenu>', function() {
  let node1, node2, edge, props, editEdgeMenu, remover

  beforeEach(function(){
    node1 = Node.new({ name: 'Person', url: 'https://example.com' })
    node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
    edge = Edge.newEdgeFromNodes(node1, node2)
    remover = sinon.fake()
    props = { 
      edge, 
      id: edge.id, 
      nodes: [node1, node2], 
      updateEdge: sinon.fake(), 
      removeEdge: remover 
    }
  })

  it("renders edit menu component", function() {
    editEdgeMenu = shallow(<EditEdgeMenu {...props} />)
    expect(editEdgeMenu.find(EditMenu)).to.have.lengthOf(1)    
  })

  it("renders main edge menu", function() {
    editEdgeMenu = shallow(<EditEdgeMenu {...props} />)
    expect(editEdgeMenu.find(MainPage)).to.have.lengthOf(1)
  })

  it("renders submit buttons", function() {
    editEdgeMenu = shallow(<EditEdgeMenu {...props} />)
    expect(editEdgeMenu.find(EditMenuSubmitButtons)).to.have.lengthOf(1)
  })

  it("renders a working delete button", function() {
    let store = createOligrapherStore(merge({}, defaultState))
    editEdgeMenu = mount(<Provider store={store}><EditEdgeMenu {...props} /></Provider>)
    let button = editEdgeMenu.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(remover.calledOnce).to.be.true
    expect(remover.firstCall.calledWithExactly(edge.id)).to.be.true
  })
})