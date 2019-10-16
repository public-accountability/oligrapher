import React from 'react'
import NodeModel from '../../../app/models/Node'
import EdgeModel from '../../../app/models/Edge'
import Edge from '../../../app/components/graph/Edge'
import EdgeLine from '../../../app/components/graph/EdgeLine'

describe('<Edge>', function() {
  let node1 = new NodeModel({x: 100, y: 100})
  let node2 = new NodeModel({x: 200, y: 200})
  let edge = new EdgeModel({ node1, node2 })

  it("renders <g> with class edge-group", function(){
    let component = shallow(<Edge edge={edge} />)
    expect(component.find('g.edge-group')).to.have.lengthOf(1)
  })

  it("renders an EdgeLine", function() {
    let component = shallow(<Edge edge={edge} />)
    expect(component.find(EdgeLine)).to.have.lengthOf(1)
  })
})
