import React from 'react'
import NodeCircle from '../../../app/components/graph/NodeCircle'

describe('<NodeCircle>', function() {
  let nodeCircle, node, radius

  beforeEach(function(){
    node = {
      x: 1,
      y: 2,
      color: '#ccc'
    }
    radius = 40
    nodeCircle  = shallow(<NodeCircle node={node} radius={radius} />)
  })

  it("renders circle with correct attributes", function(){
    let circle = nodeCircle.find('circle').first()
    expect(circle.prop('r')).to.eql(40)
    expect(circle.prop('fill')).to.eql('#ccc')
    expect(circle.prop('cx')).to.eql(1)
    expect(circle.prop('cy')).to.eql(2)
  })
})
