import React from 'react'
import noop from 'lodash/noop'

import Node from '../../app/graph/node'

import {
  EditNodeMenu,
  EditNodeMenuBody,
  MainPage
} from '../../app/containers/EditNodeMenu'

describe('<EditNodeMenu>', function() {
  it("renders nothing if not visible", function() {
    expect(
      shallow(<EditNodeMenu visible={false} node={null} id={null} updateNode={noop} />).html()
    ).to.eql(null)
  })

  it("renders EditNodeMenuBody and wrapping divs", function() {
    const node = Node.new({name: 'Corporation', url: 'https://example.com' })
    const props = { node: node,
                    id: node.id,
                    updateNode: sinon.spy(),
                    visible: true }

    const element = shallow(<EditNodeMenu {...props} />)

    expect(element.find('.oligrapher-edit-node-menu')).to.have.lengthOf(1)
    expect(element.find('header')).to.have.lengthOf(1)
    expect(element.find(EditNodeMenuBody)).to.have.lengthOf(1)
  })




})

// it("clicking on color switches page", function() {
//   expect(element.find('.oligrapher-edit-node-menu-form')).to.have.lengthOf(1) // main page
//   element.find('div.style-form > div > div > span').at(1).simulate('click')
//   expect(element.find('.oligrapher-edit-node-menu-form')).to.have.lengthOf(0)
// })
