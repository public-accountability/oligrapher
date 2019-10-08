import React from 'react'
import { Graph } from '../../app/containers/Graph'

describe('<Graph>', function(){
  it('has container div', function() {
    let graph = shallow(<Graph />)
    expect(graph.find('#oligrapher-graph').length).to.equal(1)
  })
})
