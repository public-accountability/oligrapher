import React from 'react'
import sinon from 'sinon'

import { Graph } from '../../app/containers/Graph'
import defaultState from '../../app/util/defaultState'
import { createMockStore, mountWithStore } from '../testHelpers'

describe('<Graph>', function() {
  let wrapper, setSvgSize, store

  beforeEach(function() {
    store = createMockStore(defaultState)
    setSvgSize = sinon.spy()
    wrapper = mountWithStore(
      store,
      <Graph 
        viewBox={{ minX: -200, minY: -200, w: 400, h: 400 }}
        zoom={1}
        setSvgSize={setSvgSize} />
    )
  })

  it('has graph svg wrapper div', function() {
    expect(wrapper.find('#oligrapher-graph-svg')).to.have.lengthOf(1)
  })

  it('has one svg element', function() {
    expect(wrapper.find('svg')).to.have.lengthOf(1)
  })

  xit('sets svg size once', function() {
    expect(setSvgSize.callCount).to.equal(1)
  })
})
