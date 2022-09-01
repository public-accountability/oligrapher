import values from 'lodash/values'
import Node from '../../app/graph/node'
import stateInitializer, { flatten } from '../../app/util/stateInitializer'

describe('stateInitializer', function() {
  let node, serializedState

  beforeEach(function() {
    node = Node.new()
    serializedState = {
      graph: {
        nodes: {
          [node.id]: node
        }
      }
    }
  })

  it('initializes the graph', function(){
    let initialState =  stateInitializer(serializedState)
    expect(values(initialState.graph.nodes).length).toEqual(1)
    expect(initialState.graph.edges).toEqual({})
  })

  it('flatten()', function() {
    let legacyEdge = { id: 'abc', node1_id: 1, node2_id: 2, display: { arrow: false, status: 'normal' }}
    expect(flatten(legacyEdge)).toEqual({ id: 'abc', node1_id: 1, node2_id: 2, arrow: false, status: 'normal' })
  })
})
