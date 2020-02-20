import React from 'react'
import { shallow } from 'enzyme'

import Node from '../../app/graph/node'

import { createMockStore, mountWithStore } from '../testHelpers'

import {
  EditNodeMenu,
  EditNodeMenuBody,
  MainPage
} from '../../app/containers/EditNodeMenu'

import EditNodeColorPage from '../../app/components/editor/EditNodeColorPage'
import EditMenu from '../../app/components/editor/EditMenu'

describe('<EditNodeMenu>', function() {
  let node, props, editNodeMenu, editNodeMenuBody, updater, remover

  beforeEach(function(){
    node = Node.new({name: 'Corporation', url: 'https://example.com' })
    updater = sinon.fake()
    remover = sinon.fake()
    props = { node: node, id: node.id, updateNode: updater, removeNode: remover }
    editNodeMenu = shallow(<EditNodeMenu {...props} />)
    editNodeMenuBody = shallow(<EditNodeMenuBody {...props} />)
  })

  it("renders menu body and wrapping divs", function() {
    expect(editNodeMenu.find(EditMenu)).to.have.lengthOf(1)
    expect(editNodeMenu.find(EditNodeMenuBody)).to.have.lengthOf(1)
  })

  it("starts with \"main\" page", function() {
    expect(editNodeMenuBody.find(MainPage)).to.have.lengthOf(1)
    expect(editNodeMenuBody.find(EditNodeColorPage)).to.have.lengthOf(0)
  })

  it("shows delete button which removes node", function() {
    let store = createMockStore()
    let wrapper = mountWithStore(store, <EditNodeMenu {...props} />)
    let button = wrapper.find("button[name='delete']")
    expect(button).to.have.lengthOf(1)
    button.simulate("click")
    expect(remover.getCall(0).calledWithExactly(node.id)).to.be.true
  })
})
