import React from 'react'
import GraphModel from '../../app/models/Graph'
import { Graph } from '../../app/containers/Graph'

describe('<Graph>', function(){
  const graph = new GraphModel();
  const svgAttributes = {
    viewPortWidth: 400,
    viewPortHeight: 600,
    viewBoxMinX: 0,
    viewBoxMinY: 0,
    viewBoxWidth: 400,
    viewBoxHeight: 600,
    outermost: true
  }

  it('has container div', function() {
    let element = shallow(<Graph
                            graph={graph}
                            svgAttributes={svgAttributes} />)
    expect(element.find('#oligrapher-graph').length).to.equal(1)
  })
})
