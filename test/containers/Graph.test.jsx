import React from 'react'
import { Provider } from 'react-redux'
import { createOligrapherStore} from '../../app/util/render'
import defaultState from '../../app/util/defaultState'
import { Graph } from '../../app/containers/Graph'

describe('<Graph>', function(){
  let viewBox, setActualZoom, store, graph

  beforeEach(function() {
    store = createOligrapherStore(merge({}, defaultState))
    viewBox = {minX: -200, minY: -200, w: 400, h: 400}
    setActualZoom = sinon.spy()

    graph = mount(<Provider store={store}>
                    <Graph viewBox={viewBox} setActualZoom={setActualZoom}/>
                  </Provider>)

  })

  it('has graph svg wrapper div', function() {
    expect(graph.find('.oligrapher-graph-svg')).to.have.lengthOf(1)
  })

  it('has one svg element', function() {
    expect(graph.find('svg')).to.have.lengthOf(1)
  })
})
