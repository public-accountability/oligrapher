import React from 'react'
import { shallow } from 'enzyme'

import NodeCircle from '../../app/components/NodeCircle'

import { expect } from 'chai'

describe('<NodeCircle>', function() {
  let nodeCircle, node, radius

  beforeEach(function(){
    node = {
      x: 1,
      y: 2,
      color: '#ccc',
      scale: 2
    }
    nodeCircle  = shallow(<NodeCircle node={node} status="normal" />)
  })

  it("renders circle with correct attributes", function(){
    let circle = nodeCircle.find('circle').first()
    expect(circle.prop('r')).to.eql(50)
    expect(circle.prop('fill')).to.eql('#ccc')
    expect(circle.prop('cx')).to.eql(1)
    expect(circle.prop('cy')).to.eql(2)
  })
})
