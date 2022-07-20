import values from 'lodash/values'
import sinon from 'sinon'

import Node from '../../app/graph/node'
import stateInitalizer, { flatten } from '../../app/util/stateInitalizer'
import { expect } from 'chai'

describe('stateInitalizer', function() {
  const fakeElement = { height: 100, width: 100 }
  let node, serializedState

  beforeEach(function() {
    sinon.stub(document, 'getElementById').returns(fakeElement)
    node = Node.new()
    serializedState = {
      graph: {
        nodes: {
          [node.id]: node
        }
      }
    }
  })

  afterEach(function() {
    document.getElementById.restore()
  })

  it('initializes the graph', function(){
    let initialState = stateInitalizer(serializedState)
    expect(values(initialState.graph.nodes)).to.have.lengthOf(1)
    expect(initialState.graph.edges).to.eql({})
  })

  specify('flatten()', function() {
    let legacyEdge = { id: 'abc', node1_id: 1, node2_id: 2, display: { arrow: false, status: 'normal' }}
    expect(flatten(legacyEdge)).to.eql({ id: 'abc', node1_id: 1, node2_id: 2, arrow: false, status: 'normal' })
  })
})
