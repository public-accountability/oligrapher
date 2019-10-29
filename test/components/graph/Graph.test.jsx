import React from 'react'
import Graph from '../../../app/components/graph/Graph'
import { newGraph } from '../../../app/graph/graph'

describe('<Graph>', function() {
  it('renders', function() {
    let g = newGraph()
    let changed = sinon.spy()
    let component = shallow(<Graph graph={g} changed={changed}/>)
    expect(component).to.be.ok
  })
})
