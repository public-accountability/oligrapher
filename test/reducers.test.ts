import { createReducer } from "@reduxjs/toolkit"
import reducerBuilder from "../app/reducer"
import Graph from "../app/graph/graph"
import Node from "../app/graph/node"
import Edge from "../app/graph/edge"

import defaultState from "../app/util/defaultState"
import { cloneDeep, values } from "lodash"

const reducer = createReducer({}, reducerBuilder)

const setupState = () => cloneDeep(defaultState)

describe("graphReducer", function () {
  describe("ADD_NODE", function () {
    it("adds node to graph", function () {
      const node = Node.new()
      const state = defaultState
      const action = { type: "ADD_NODE", node }
      const nextState = reducer(state, action)
      expect(Object.keys(nextState.graph.nodes)).toEqual([node.id])
    })
  })

  describe("REMOVE_NODE", function () {
    it("removes node and edges from graph", function () {
      let state = setupState()
      const n1 = Node.new()
      const n2 = Node.new()
      const n3 = Node.new()
      const e1 = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      const e2 = Edge.new({ node1_id: n1.id, node2_id: n3.id })
      Graph.addNodes(state.graph, [n1, n2, n3])
      Graph.addEdge(state.graph, e1)
      Graph.addEdge(state.graph, e2)
      const action = { type: "REMOVE_NODE", id: n1.id }
      const nextState = reducer(state, action)
      expect(Object.keys(nextState.graph.nodes)).toEqual([n2.id, n3.id])
    })
  })

  describe("DRAG_NODE", function () {
    it("moves edge but not node", function () {
      const state = setupState()
      const n1 = Node.new({ x: 0, y: 0 })
      const n2 = Node.new({ x: 100, y: 0 })
      const n3 = Node.new({ x: 0, y: 100 })
      const e1 = Edge.newEdgeFromNodes(n1, n2)
      Graph.addNodes(state.graph, [n1, n2, n3])
      Graph.addEdge(state.graph, e1)
      const action = { type: "DRAG_NODE", id: n1.id, node: n1, deltas: { x: 50, y: 50 } }
      const nextState = reducer(state, action)
      expect(nextState.graph.nodes[n1.id].x).toBe(n1.x)
      expect(nextState.graph.nodes[n1.id].y).toBe(n1.y)
      expect(nextState.graph.edges[e1.id].x1).toBe(e1.x1 + 50)
      expect(nextState.graph.edges[e1.id].y1).toBe(e1.y1 + 50)
    })
  })

  describe("MOVE_NODE_OR_ADD_EDGE_FROM_DRAG", function () {
    it("moves node and its edges when no intersection", function () {
      const state = setupState()
      state.display.modes.editor = true
      const n1 = Node.new({ x: 0, y: 0 })
      Graph.addNodes(state.graph, [n1])
      const action = {
        type: "MOVE_NODE_OR_ADD_EDGE_FROM_DRAG",
        id: n1.id,
        deltas: { x: 50, y: 50 },
      }
      const nextState = reducer(state, action)
      expect(nextState.graph.nodes[n1.id].x).toEqual(n1.x + 50)
      expect(nextState.graph.nodes[n1.id].y).toEqual(n1.y + 50)
    })
  })

  describe("ADD_EDGES", function () {
    it("adds only edges with existing nodes", function () {
      const state = setupState()
      const n1 = Node.new()
      const n2 = Node.new()
      const n3 = Node.new()
      const n4 = Node.new() // some node that's not around anymore
      const e1 = Edge.newEdgeFromNodes(n1, n3)
      const e2 = Edge.newEdgeFromNodes(n2, n3)
      const e3 = Edge.newEdgeFromNodes(n3, n4) // shouldn't be added
      Graph.addNodes(state.graph, [n1, n2, n3])
      const action = { type: "ADD_EDGES", edges: [e1, e2, e3] }
      const nextState = reducer(state, action)
      expect(Object.keys(nextState.graph.edges)).toEqual([e1.id, e2.id])
    })
  })

  describe("REMOVE_EDGE", function () {
    it("removes edge from graph", function () {
      const state = setupState()
      const n1 = Node.new()
      const n2 = Node.new()
      const n3 = Node.new()
      const e1 = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      const e2 = Edge.new({ node1_id: n1.id, node2_id: n3.id })
      Graph.addNodes(state.graph, [n1, n2, n3])
      Graph.addEdge(state.graph, e1)
      Graph.addEdge(state.graph, e2)
      const action = { type: "REMOVE_EDGE", id: e2.id }
      const nextState = reducer(state, action)
      expect(values(nextState.graph.edges)).toEqual([e1])
    })
  })
})

describe("displayReducer", function () {
  describe("SET_EDITOR_MODE", function () {
    it("changes editor to true", function () {
      const state = setupState()
      state.display.modes.editor = false
      state.display.floatingEditor = { type: null, id: null }
      const action = { type: "SET_EDITOR_MODE", enabled: true }
      expect(reducer(state, action).display.modes.editor).toEqual(true)
    })

    it("clears floating editor", function () {
      const state = setupState()
      state.display.modes.editor = false
      state.display.floatingEditor = { type: "node", id: "abc" }
      const action = { type: "SET_EDITOR_MODE", enabled: true }
      expect(reducer(state, action).display.floatingEditor).toEqual({ type: null, id: null })
    })
  })

  describe("TOGGLE_TOOL", function () {
    it("changes tool", function () {
      const state = setupState()
      state.display.tool = "node"
      state.display.floatingEditor = { type: "node", id: "abc" }
      const action = { type: "TOGGLE_TOOL", tool: "text" }
      expect(reducer(state, action).display.tool).toEqual("text")
    })

    it("closes tool", function () {
      const state = setupState()
      state.display.tool = "node"
      state.display.floatingEditor = { type: "node", id: "abc" }
      const action = { type: "TOGGLE_TOOL", tool: "node" }
      expect(reducer(state, action).display.tool).toBeNull()
    })
  })

  describe("CLICK_NODE", function () {
    it("opens and closes node editor", function () {
      const state = setupState()
      const node = Node.new({ x: 0, y: 0, id: "xyz" })
      Graph.addNode(state.graph, node)
      state.display.floatingEditor = { type: "node", id: "xyz" }
      let action = { type: "CLICK_NODE", id: "xyz" }
      const state1 = reducer(state, action)
      expect(state1.display.floatingEditor).toEqual({ type: null, id: null })
      const state2 = reducer(state1, action)
      expect(state2.display.floatingEditor).toEqual({ type: "node", id: "xyz" })
    })
  })

  describe("CLOSE_EDITOR", function () {
    it("clears floatingEditor", function () {
      const state = setupState()
      state.display.tool = "node"
      state.display.floatingEditor = { type: "connections", id: "xyz" }
      const action = { type: "CLOSE_EDITOR" }
      expect(reducer(state, action).display.floatingEditor).toEqual({ type: null, id: null })
    })
  })

  describe("ADD_NODE", function () {
    let state = setupState()

    it("opens and positions node editor if node is not from LittleSis", function () {
      const node = { id: "abc", name: "bob", x: 100, y: 100 }
      const action = { type: "ADD_NODE", node }
      const nextState = reducer(state, action)
      expect(nextState.display.floatingEditor.type).toEqual("node")
      expect(nextState.display.floatingEditor.id).toBeTruthy()
    })

    it("does not open node editor if node is from LittleSis", function () {
      const node = Node.new({ id: "1000" })
      const action = { type: "ADD_NODE", node }
      const nextState = reducer(state, action)
      expect(nextState.display.floatingEditor.type).toBeNull()
      expect(nextState.display.floatingEditor.id).toBeNull()
    })
  })

  describe("REMOVE_NODE", function () {
    it("closes floating menu", function () {
      const state = setupState()
      const node = Node.new({ id: "r2d2" })
      Graph.addNode(state.graph, node)
      state.display.floatingEditor = { type: "node", id: "r2d2" }
      const action = { type: "REMOVE_NODE", id: "r2d2" }
      const nextState = reducer(state, action)
      expect(nextState.display.floatingEditor.type).toBeNull()
      expect(nextState.display.floatingEditor.id).toBeNull()
    })
  })

  describe("DRAG_NODE", function () {
    it("sets dragged node", function () {
      const node = Node.new({ name: "cleo" })
      const state = setupState()
      Graph.addNode(state.graph, node)
      const action = { type: "DRAG_NODE_START", id: node.id, node: node, deltas: { x: 0, y: 100 } }
      const nextState = reducer(state, action)
      expect(nextState.display.draggedNode).toEqual(node.id)
    })
  })

  describe("REMOVE_EDGE", function () {
    it("closes floating menu", function () {
      const state = setupState()
      const node1 = Node.new()
      const node2 = Node.new()
      Graph.addNodes(state.graph, [node1, node2])
      const edge = Edge.newEdgeFromNodes(node1, node2)
      Graph.addEdge(state.graph, edge)
      expect(state.graph.edges[edge.id]).toBeTruthy()
      state.display.floatingEditor = { type: "edge", id: edge.id }
      const action = { type: "REMOVE_EDGE", id: edge.id }
      const nextState = reducer(state, action)
      expect(nextState.display.floatingEditor.type).toBeNull()
      expect(nextState.display.floatingEditor.id).toBeNull()
      expect(nextState.graph.edges[edge.id]).toBeFalsy()
    })
  })

  describe("CLICK_EDGE", function () {
    it("opens edge editor", function () {
      const state = setupState()
      state.display.floatingEditor = { type: null, id: null }
      const action = { type: "CLICK_EDGE", id: "xyz" }
      expect(reducer(state, action).display.floatingEditor).toEqual({ type: "edge", id: "xyz" })
    })

    it("closes edge editor", function () {
      const state = setupState()
      state.display.floatingEditor = { type: "edge", id: "xyz" }
      const action = { type: "CLICK_EDGE", id: "xyz" }
      expect(reducer(state, action).display.floatingEditor).toEqual({ type: null, id: null })
    })
  })
})
