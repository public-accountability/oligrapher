import { reducer } from '../../app/reducers/graphReducer'
import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'
import defaultState from '../../app/util/defaultState'
import values from 'lodash/values'

describe('graphReducer', function() {
  describe('ADD_NODE', function() {
    let node, state, action, nextState

    it('adds node to graph', function() {
      node = Node.new()
      state = defaultState.graph
      action = { type: 'ADD_NODE', node }
      nextState = reducer(state, action)
      expect(Object.keys(nextState.nodes)).toEqual([node.id])
    })
  })

  describe('REMOVE_NODE', function() {
    let graph, state, action, nextState, e1, e2, n1, n2, n3

    beforeEach(function() {
      graph = Graph.new()
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      e1 = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      e2 = Edge.new({ node1_id: n1.id, node2_id: n3.id })
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, e1)
      Graph.addEdge(graph, e2)
      action = { type: 'REMOVE_NODE', id: n1.id }
      state = graph
      nextState = reducer(state, action)
    })

    it('removes node and edges from graph', function() {
      expect(Object.keys(nextState.nodes)).toEqual([n2.id, n3.id])
    })

  })

  describe('DRAG_NODE', function() {
    let state, graph, action, nextState, n1, n2, n3, e1

    beforeEach(function() {
      graph = Graph.new()
      n1 = Node.new({ x: 0, y: 0 })
      n2 = Node.new({ x: 100, y: 0 })
      n3 = Node.new({ x: 0, y: 100 })
      e1 = Edge.newEdgeFromNodes(n1, n2)
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, e1)
      state = graph
    })

    it('moves edge but not node', function() {
      action = { type: 'DRAG_NODE', id: n1.id, node: n1, deltas: { x: 50, y: 50 } }
      nextState = reducer(state, action)
      expect(nextState.nodes[n1.id].x).toBe(n1.x)
      expect(nextState.nodes[n1.id].y).toBe(n1.y)
      expect(nextState.edges[e1.id].x1).toBe(e1.x1 + 50)
      expect(nextState.edges[e1.id].y1).toBe(e1.y1 + 50)
    })
  })

  describe('MOVE_NODE', function() {
    let state, graph, action, nextState, n1, n2, n3, e1

    beforeEach(function() {
      graph = Graph.new()
      n1 = Node.new({ x: 0, y: 0 })
      Graph.addNodes(graph, [n1])
      state = graph
    })

    it('moves node and its edges when no intersection', function() {
      action = { type: 'MOVE_NODE', id: n1.id, deltas: { x: 50, y: 50 } }
      nextState = reducer(state, action)
      expect(nextState.nodes[n1.id].x).toEqual(n1.x + 50)
      expect(nextState.nodes[n1.id].y).toEqual(n1.y + 50)
    })
  })

  describe('ADD_EDGES', function() {
    let state, action, nextState, graph, n1, n2, n3, n4, e1, e2, e3

    beforeEach(function() {
      graph = Graph.new()
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      n4 = Node.new() // some node that's not around anymore
      e1 = Edge.newEdgeFromNodes(n1, n3)
      e2 = Edge.newEdgeFromNodes(n2, n3)
      e3 = Edge.newEdgeFromNodes(n3, n4) // shouldn't be added
      Graph.addNodes(graph, [n1, n2, n3])

      state = graph
      action = { type: 'ADD_EDGES', edges: [e1, e2, e3] }
      nextState = reducer(state, action)
    })

    it('adds only edges with existing nodes', function() {
      expect(Object.keys(nextState.edges)).toEqual([e1.id, e2.id])
    })
  })

  describe('REMOVE_EDGE', function() {
    let state, action, nextState, e1, e2

    beforeEach(function() {
      let graph = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      let n3 = Node.new()
      e1 = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      e2 = Edge.new({ node1_id: n1.id, node2_id: n3.id })
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, e1)
      Graph.addEdge(graph, e2)

      state = graph
      action = { type: 'REMOVE_EDGE', id: e2.id }
      nextState = reducer(state, action)
    })

    it('removes edge from graph', function() {
      expect(values(nextState.edges)).toEqual([e1])
    })
  })
})
