import React from 'react'
import { shallow } from 'enzyme'

import Node from '../../app/graph/node'

import { createMockStore, mountWithStore } from '../testHelpers'

import {
  EditNode,
  MainPage
} from '../../app/containers/EditNodeMenu'

import EditNodeColorPage from '../../app/components/editor/EditNodeColorPage'

describe('<EditNode>', function() {
  let node, props, editNode, updater, remover

  beforeEach(function(){
    node = Node.new({name: 'Corporation', url: 'https://example.com' })
    updater = sinon.fake()
    remover = sinon.fake()
    props = { node: node, id: node.id, updateNode: updater, removeNode: remover }
    editNode = shallow(<EditNode {...props} />)
  })

  it("starts with \"main\" page", function() {
    expect(editNode.find(MainPage)).to.have.lengthOf(1)
    expect(editNode.find(EditNodeColorPage)).to.have.lengthOf(0)
  })

  it("shows delete button which removes node", function() {
    let store = createMockStore()
    let wrapper = mountWithStore(store, <EditNode {...props} />)
    let button = wrapper.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(remover.getCall(0).calledWithExactly(node.id)).to.be.true
  })
})
