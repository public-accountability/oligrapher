import React from 'react'
import { Edge } from '../../app/containers/Edge'
import EdgeLine from '../../app/components/graph/EdgeLine'

describe('<Edge>', function() {
  let props = {
    id: '123',
    scale: 1,
    arrow: null,
    dash: false,
    url: 'http://example.com',
    status: 'normal',
    curve: "M 1.0,2.0 Q 3.0,4.0,5.0,6.0"
  }

  let component

  beforeEach(function() {
    component = shallow(<Edge {...props} />)
  })

  it("renders <g> with class edge-group", function(){
    expect(component.find('g.edge-group')).to.have.lengthOf(1)
  })

  it("renders an EdgeLine", function() {
    expect(component.find(EdgeLine)).to.have.lengthOf(1)
  })
})
