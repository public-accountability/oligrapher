import React from 'react'
import Root from '../../app/containers/Root'
import Header from '../../app/containers/Header'
import Graph from '../../app/containers/Graph'
import ZoomControl from '../../app/components/ZoomControl'

describe('<Root>', function() {
  let root

  beforeEach(function(){
    root = shallow(<Root />)
  })

  it('has container div', function()  {
    expect(root.find('#oligrapher-container').length).to.equal(1)
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
})
