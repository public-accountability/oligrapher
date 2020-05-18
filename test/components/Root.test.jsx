import React from 'react'
import { shallow } from 'enzyme'

import { Root } from '../../app/components/Root'
import Header from '../../app/components/Header'
import Graph from '../../app/components/Graph'
import ZoomControl from '../../app/components/ZoomControl'
import FloatingEditors from '../../app/components/FloatingEditors'
import UserMessage from '../../app/components/UserMessage'

describe('<Root>', function() {
  let root

  beforeEach(function(){
    root = shallow(<Root />)
  })

  it('has container div', function()  {
    expect(root.find('#oligrapher-container')).to.have.lengthOf(1)
  })

  it('has header container', function() {
    expect(root.find(Header).length).to.equal(1)
  })

  it('has graph container', function(){
    expect(root.find(Graph).length).to.equal(1)
  })

  it('has ZoomControl', function() {
    expect(root.find(ZoomControl)).to.have.lengthOf(1)
  })

  it('has FloatingEditors', function() {
    expect(root.find(FloatingEditors)).to.have.lengthOf(1)
  })

  it('has UserMessage', function() {
    expect(root.find(UserMessage)).to.have.lengthOf(1)
  })
})
