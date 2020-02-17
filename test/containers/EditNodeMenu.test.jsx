import React from 'react'

import Node from '../../app/graph/node'

import {
  EditNodeMenu,
  EditNodeMenuBody,
  MainPage
} from '../../app/containers/EditNodeMenu'

import EditNodeColorPage from '../../app/components/editor/EditNodeColorPage'
import EditNodeBioPage from '../../app/components/editor/EditNodeBioPage'
import CustomizeButton from '../../app/components/editor/CustomizeButton'
import EditMenu from '../../app/components/editor/EditMenu'
import EditMenuSubmitButtons from '../../app/components/editor/EditMenuSubmitButtons'

describe('<EditNodeMenu>', function() {
  let node, props, editNodeMenu, editNodeMenuBody

  beforeEach(function(){
    node = Node.new({name: 'Corporation', url: 'https://example.com' })
    props = { node: node, id: node.id, updateNode: sinon.spy() }
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
})
