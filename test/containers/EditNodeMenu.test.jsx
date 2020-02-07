import React from 'react'

import Node from '../../app/graph/node'

import {
  EditNodeMenu,
  EditNodeMenuBody
} from '../../app/containers/EditNodeMenu'

import EditMenuHeader from '../../app/components/editor/EditMenuHeader'

describe('<EditNodeMenu>', function() {
  it("renders EditNodeMenuBody and wrapping divs", function() {
    const node = Node.new({name: 'Corporation', url: 'https://example.com' })
    const props = { node: node,
                    id: node.id,
                    updateNode: sinon.spy() }

    const element = shallow(<EditNodeMenu {...props} />)

    expect(element.find('.oligrapher-edit-node-menu')).to.have.lengthOf(1)
    expect(element.find(EditMenuHeader)).to.have.lengthOf(1)
    expect(element.find(EditNodeMenuBody)).to.have.lengthOf(1)
  })
})

// it("clicking on color switches page", function() {
//   expect(element.find('.oligrapher-edit-node-menu-form')).to.have.lengthOf(1) // main page
//   element.find('div.style-form > div > div > span').at(1).simulate('click')
//   expect(element.find('.oligrapher-edit-node-menu-form')).to.have.lengthOf(0)
// })
