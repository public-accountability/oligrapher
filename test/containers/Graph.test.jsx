import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore, mountWithStore } from '../testHelpers'
import { Graph } from '../../app/containers/Graph'

describe('<Graph>', function() {
  let viewBox, setActualZoom, store, wrapper, props

  beforeEach(function() {
    store = createMockStore()
    viewBox = {minX: -200, minY: -200, w: 400, h: 400}
    setActualZoom = sinon.spy()
    props = {
      viewBox,
      setActualZoom, 
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

  it('sets actual zoom once', function() {
    expect(setActualZoom.callCount).to.equal(1)
    props.zoom = 2
    wrapper.setProps(props)
    expect(setActualZoom.callCount).to.equal(2)
  })
})
