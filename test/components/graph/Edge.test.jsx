import React from 'react'
import EdgeModel from '../../../app/models/Edge'
import Edge from '../../../app/components/graph/Edge'

describe('<Edge>', function() {
  it("renders <g> with class edge-group", function(){
    let edge = new EdgeModel()
    let component = shallow(<Edge edge={edge} />)
    expect(component.find('g.edge-group')).to.have.lengthOf(1)
  })

  it("renders <path> with class edge-path", function() {
    let edge = new EdgeModel()
    let component = shallow(<Edge edge={edge} />)
    expect(component.find('path.edge-path')).to.have.lengthOf(1)
  })
})
