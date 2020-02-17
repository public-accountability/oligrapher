import React from 'react'
import NodeCircle from '../../../app/components/graph/NodeCircle'

describe('<NodeCircle>', function() {
  let nodeCircle

  beforeEach(function(){
    let props = {
      x: 1,
      y: 2,
      radius: 40,
      color: '#ccc',
    }
    nodeCircle  = shallow(<NodeCircle {...props} />)
  })

  it("renders circle with correct attributes", function(){
    let circle = nodeCircle.find('circle').first()
    expect(circle.prop('r')).to.eql(40)
    expect(circle.prop('fill')).to.eql('#ccc')
    expect(circle.prop('cx')).to.eql(1)
    expect(circle.prop('cy')).to.eql(2)
  })
})
