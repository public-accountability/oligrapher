import React from 'react'
import Node from '../../app/graph/node'
import { EditNodeMenu } from '../../app/containers/EditNodeMenu'

describe('<EditNodeMenu>', function() {
  let node, element

  beforeEach(function(){
    node = Node.new({name: 'Corporation', url: 'https://example.com' })
    element = shallow(<EditNodeMenu {...node} />)
  })

  it('has container, header, and footer', function() {
    expect(element.find('.edit-node-menu')).to.have.lengthOf(1)
    expect(element.find('header')).to.have.lengthOf(1)
    expect(element.find('footer')).to.have.lengthOf(1)
  })

  it('renders main page by default', function() {
    expect(element.find('.oligrapher-edit-node-menu-form')).to.have.lengthOf(1)
  })
})
