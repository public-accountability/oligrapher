import React from 'react'
import { DraggableCore } from 'react-draggable'
import noop from 'lodash/noop'

import { Edge } from '../../app/containers/Edge'
import EdgeLine from '../../app/components/graph/EdgeLine'
import EdgeHandle from '../../app/components/graph/EdgeHandle'
import EdgeLabel from '../../app/components/graph/EdgeLabel'

const defaultEdgeProps = {
  "id": "x4",
  "node1_id": 1000,
  "node2_id": "x3",
  "cx": -25.38628860892241,
  "cy": 57.53275876918979,
  "scale": 1.5,
  "arrow": '1->2',
  "label": "Board of Directors",
  "dash": false,
  "url": "/relationships/819315",
  "x1": -311.01857898692043,
  "y1": 162.3706066386352,
  "x2": -145.21592048677672,
  "y2": 278.27380873087156,
  "s1": 2,
  "s2": 1,
  "status": "normal",
  "actualZoom": 0.5359068442019607,
  "showLabel": true
}

function createTestEdge(additionalProps = {}) {
  let spies = {
    updateEdge: sinon.spy(),
    openEdgeMenu: sinon.spy()
  }

  let props = { ...defaultEdgeProps, ...spies, ...additionalProps }
  let component = mount( <Edge {...props} /> )

  return { spies, props, component }
}

describe('<Edge>', function() {
  it("renders correct components", function() {
    const { component } = createTestEdge()
    expect(component.find(DraggableCore)).to.have.lengthOf(1)
    expect(component.find('g.edge-group')).to.have.lengthOf(1)
    expect(component.find(EdgeLine)).to.have.lengthOf(1)
    expect(component.find(EdgeHandle)).to.have.lengthOf(1)
  })

  it("calls props.openEdgeMenu after clicking", function() {
    const { component, spies } = createTestEdge()

    component.find(EdgeHandle).simulate('click', { preventDefault: noop })
    expect(spies.openEdgeMenu.callCount).to.eql(1)
  })

  it("labels can be hide or shown", function() {
    expect( createTestEdge({showLabel: false}).component.find(EdgeLabel)).to.be.empty
    expect(createTestEdge({showLabel: true}).component.find(EdgeLabel)).to.have.lengthOf(1)
  })
})
