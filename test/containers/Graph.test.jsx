import React from 'react'
import sinon from 'sinon'
import { createMockStore, mountWithStore } from '../testHelpers'
import { Graph } from '../../app/containers/Graph'

describe('<Graph>', function() {
  let viewBox, setSvgSize, store, wrapper, props

  beforeEach(function() {
    store = createMockStore()
    viewBox = {minX: -200, minY: -200, w: 400, h: 400}
    setSvgSize = sinon.spy()
    props = {
      viewBox,
      setSvgSize, 
      zoom: 1
    }
    wrapper = mountWithStore(store, <Graph {...props} />)
  })

  it('has graph svg wrapper div', function() {
    expect(wrapper.find('.oligrapher-graph-svg')).to.have.lengthOf(1)
  })

  it('has one svg element', function() {
    expect(wrapper.find('svg')).to.have.lengthOf(1)
  })

  it('sets svg size once', function() {
    expect(setSvgSize.callCount).to.equal(1)
  })
})
