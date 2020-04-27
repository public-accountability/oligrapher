import React from 'react'
import { createMockStore, mountWithStore, stubDispatch } from '../testHelpers'
import Graph from '../../app/containers/Graph'

describe('<Graph>', function() {
  let store, wrapper, state, mockDispatch

  beforeEach(function() {
    mockDispatch = stubDispatch()
    state = { display: { 
      viewBox: { minX: -200, minY: -200, w: 400, h: 400 },
      zoom: 1
    } }
    store = createMockStore(state)
    wrapper = mountWithStore(store, <Graph />)
  })

  afterEach(function() {
    mockDispatch.restore()
  })

  it('has graph svg wrapper div', function() {
    expect(wrapper.find('.oligrapher-graph-svg')).to.have.lengthOf(1)
  })

  it('has one svg element', function() {
    expect(wrapper.find('svg')).to.have.lengthOf(1)
  })

  it('sets svg size once', function() {
    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0].type).to.equal('SET_SVG_SIZE')
  })
})
