import * as helpers from '../../app/helpers'
import stateInitalizer from '../../app/util/stateInitalizer'
import Graph from '../../app/models/Graph'

describe('stateInitalizer', function() {
  const fakeElement = { height: 100, width: 100 }

  beforeEach(function() {
    sinon.stub(helpers, 'getElementById').returns(fakeElement)
  })

  afterEach(function() {
    helpers.getElementById.restore()
  })


  let serializedState = {
    graph: {
      nodes: {
        'test1': {
          x: 1,
          y: 1,
          id: 'test1'
        }
      }
    }
  }

  it('initializes the graph', function(){
    let initialState = stateInitalizer(serializedState)
    expect(initialState.graph).to.be.an.instanceOf(Graph)
  })
})
