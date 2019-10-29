import React from 'react'
import { newGraph } from '../../app/graph/graph'
import Graph from '../../app/containers/Graph'

xdescribe('<Graph>', function(){
  const graph = newGraph()
  it('has container div', function() {
    let element = shallow(<Graph graph={graph}/>)
    expect(element.find('#oligrapher-graph').length).to.equal(1)
  })
})
