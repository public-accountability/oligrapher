import React from 'react'
import NodeCircle from '../../../app/components/graph/NodeCircle'

describe('<NodeCircle>', function() {
  let coords = [20,30]
  let nodeCircle

  beforeEach(function(){
    nodeCircle  = shallow(<NodeCircle coords={coords} />)
  })

  it("renders <g>", function(){
    expect(nodeCircle.find('g')).to.have.lengthOf(1)
    expect(nodeCircle.find('g').first().hasClass('node-circle-group')).to.be.ok
  })

  it("renders circle with correct attributes", function(){
    let circle = nodeCircle.find('circle').first()
    expect(circle.prop('r')).to.eql(25)
    expect(circle.prop('fill')).to.eql('#ccc')
    expect(circle.prop('cx')).to.eql(20)
    expect(circle.prop('cy')).to.eql(30)
  })
})
