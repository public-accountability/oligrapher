import values from 'lodash/values'
import * as helpers from '../../app/util/helpers'
import Node from '../../app/graph/node'
import stateInitalizer from '../../app/util/stateInitalizer'

describe('stateInitalizer', function() {
  const fakeElement = { height: 100, width: 100 }

  beforeEach(function() {
    sinon.stub(helpers, 'getElementById').returns(fakeElement)
  })

  afterEach(function() {
    helpers.getElementById.restore()
  })

  let node = Node.new()

  let serializedState = {
    graph: {
      nodes: {
        [node.id]: node
      }
    }
  }

  it('initializes the graph', function(){
    let initialState = stateInitalizer(serializedState)
    expect(values(initialState.graph.nodes)).to.have.lengthOf(1)
    expect(initialState.graph.edges).to.eql({})
  })
})
