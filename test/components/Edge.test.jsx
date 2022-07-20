import React from 'react'
import { expect } from 'chai'
import { DraggableCore } from 'react-draggable'

import { Edge } from '../../app/components/Edge'
import EdgeLine from '../../app/components/EdgeLine'
import EdgeHandle from '../../app/components/EdgeHandle'
import EdgeLabel from '../../app/components/EdgeLabel'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<Edge>', function() {
  let wrapper, node1, node2, edge, state, store

  beforeEach(function() {
    node1 = { id: "1000" }
    node2 = { id: "x3" }
    edge = {
      id: "x4",
      node1_id: "1000",
      node2_id: "x3",
      cx: -25.38628860892241,
      cy: 57.53275876918979,
      scale: 1.5,
      arrow: '1->2',
      label: "Board of Directors",
      dash: false,
      status: "normal",
      url: "/relationships/819315",
      x1: -311.01857898692043,
      y1: 162.3706066386352,
      x2: -145.21592048677672,
      y2: 278.27380873087156,
      s1: 2,
      s2: 1
    }
    state = {
      graph: {
        nodes: { "1000": node1, "x3": node2 },
        edges: { 'x4': edge }
      },
      display: { actualZoom: 1, modes: { editor: true } }
    }
    store = createMockStore(state)
    wrapper = mountWithStore(
      store,
      <svg><Edge id={edge.id} currentlyEdited={false} /></svg>
    )
  })

  it("renders correct components", function() {
    expect(wrapper.find(DraggableCore)).to.have.lengthOf(1)
    expect(wrapper.find('g.oligrapher-edge')).to.have.lengthOf(1)
    expect(wrapper.find(EdgeLine)).to.have.lengthOf(1)
    expect(wrapper.find(EdgeHandle)).to.have.lengthOf(1)
    expect(wrapper.find(EdgeLabel)).to.have.lengthOf(1)
  })
})
