import React from 'react'
import EdgeModel from '../../../app/models/Edge'
import Edge from '../../../app/components/graph/Edge'


describe.only('<Edge>', function() {
  let edge = new Edge()

  it("renders <g> with class edge", function(){
    let component = shallow(<Edge edge={edge} />)
    expect(component.find('g.edge')).to.have.lengthOf(1)
  })

})
