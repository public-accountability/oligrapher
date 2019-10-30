import React from 'react'
import Graph from '../../../app/components/graph/Graph'
import GraphContainer from '../../../app/components/graph/GraphContainer'
import { newGraph } from '../../../app/graph/graph'

describe('<Graph>', function() {
  describe('components', function() {
    let g, changed, component

    beforeEach(function() {
      g = newGraph()
      changed = sinon.spy()
      component = shallow(<Graph graph={g} changed={changed}/>)
    })

    it('renders', function() {
      expect(component).to.be.ok
    })

    it('renders a graph container', function() {
      expect(component.find(GraphContainer)).to.have.lengthOf(1)
    })
  })
})
