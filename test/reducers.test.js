import reducers from '../app/reducers'
import Graph from '../app/graph/graph'
import Node from '../app/graph/node'
import Edge from '../app/graph/edge'
import defaultState from '../app/util/defaultState'
import { transformNodePosition } from '../app/util/floatingMenu'

import values from 'lodash/values'

describe('Reducer', function() {
  describe('SET_MODE', function() {
    it('changes editor to true', function() {
      const state = { foo: 'bar',
                      display: { modes: { editor: false, story: false } } }

      const action = {type: 'SET_MODE', mode: 'editor', enabled: true}

      expect(reducers(state, action))
        .to.eql({ foo: 'bar', display: { modes: { editor: true, story: false } }})
    })
  })

  describe('OPEN_TOOL', function() {
    it('changes tool', function() {
      const state = { 
        display: { 
          editor: { tool: 'node' },
          floatingMenu: { type: 'node', id: 'abc', position: null }
        }
      }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action).display.editor) .to.eql({ tool: 'edge' })
    })

    it("clears floatingMenu", function() {
      const state = { 
        display: { 
          editor: { tool: 'node' },
          floatingMenu: { type: 'node', id: 'abc', position: null }
        }
      }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action).display.floatingMenu) .to.eql({ type: null, id: null, position: null })
    })

    it("sets floating menu for settings", function(){
      const state = { display: { 
        floatingMenu: { type: null, id: null }, 
        editor: { tool: 'caption' } 
      } }
      const action = { type: 'OPEN_TOOL', item: 'settings'}
      expect(reducers(state, action)) .to.eql({ 
        display: { 
          floatingMenu: { type: 'settings', id: null, position: null }, 
          editor: { tool: 'settings' } 
        }
      })
    })
  })

  describe('CLICK_NODE', function() {
    it('opens node editor', function() {
      const state = { display : { floatingMenu: { type: null, id: null, position: null } } }
      const action = { type: 'CLICK_NODE', id: 'xyz', x: 100, y: 100, actualZoom: 1 }
      expect(reducers(state, action).display.floatingMenu)
        .to.eql({ type: 'node', id: 'xyz', position: transformNodePosition({ x: 100, y: 100 }, 1) })
    })

    it('closes node editor', function() {
      const state = { display : { floatingMenu: { type: 'node', id: 'xyz', position: { x: 100, y: 100 } } } }
      const action = { type: 'CLICK_NODE', id: 'xyz', x: 100, y: 100, actualZoom: 1 }
      expect(reducers(state, action).display.floatingMenu)
        .to.eql({ type: null, id: null, position: null })
    })

    it('closes add connections', function() {
      const state = { display : { floatingMenu: { type: 'connections', id: 'xyz', position: { x: 100, y: 100 } } } }
      const action = { type: 'CLICK_NODE', id: 'xyz', x: 100, y: 100, actualZoom: 1 }
      expect(reducers(state, action).display.floatingMenu)
        .to.eql({ type: null, id: null, position: null })
    })
  })

  describe('CLOSE_EDIT_MENU', function() {
    it('clears floatingMenu', function() {
      const state = { display : { editor: { tool: 'node' }, floatingMenu: { type: 'node', id: 'abc', position: { x: 1, y: 2 } } } }
      const action = { type: 'CLOSE_EDIT_MENU' }
      expect(reducers(state, action).display.floatingMenu)
        .to.eql({ type: null, id: null, position: null })
    })   
  })

  describe('ADD_NODE', function() {
    let node, state, action, nextState

    it('adds node to graph', function() {
      node = Node.new()
      state = defaultState
      action = { type: 'ADD_NODE', attributes : node }
      nextState = reducers(state, action)
      expect(Object.keys(nextState.graph.nodes)).to.eql([node.id])
    })

    it('opens and positions node editor if node isnt from LittleSis', function() {
      node = { name: "bob" }
      state = defaultState
      action = { type: 'ADD_NODE', attributes : node }
      nextState = reducers(state, action)
      expect(nextState.display.floatingMenu.type).to.equal('node')
      expect(nextState.display.floatingMenu.id).to.not.be.null
      expect(nextState.display.floatingMenu.position).to.not.be.null
    })

    it('doesnt open node editor node is from LittleSis', function() {
      node = Node.new()
      state = defaultState
      action = { type: 'ADD_NODE', attributes : node }
      nextState = reducers(state, action)
      expect(nextState.display.floatingMenu.type).to.be.null
      expect(nextState.display.floatingMenu.id).to.be.null
      expect(nextState.display.floatingMenu.position).to.be.null
    })
  })

  describe('REMOVE_NODE', function() {
    let state, action, nextState, e1, e2, n1, n2, n3

    beforeEach(function() {
      let graph = Graph.new()
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      e1 = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      e2 = Edge.new({ node1_id: n1.id, node2_id: n3.id })
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, e1)
      Graph.addEdge(graph, e2)
      state = { graph, display: { floatingMenu: { type: 'node', id: n1.id } } }
      action = { type: 'REMOVE_NODE', id: n1.id }
      nextState = reducers(state, action)  
    })

    it('removes node from graph', function() {
      expect(Object.keys(nextState.graph.nodes)).to.eql([n2.id, n3.id])
    })

    it('closes floating menu', function() {
      expect(nextState.display.floatingMenu.type).to.eql(null)
      expect(nextState.display.floatingMenu.id).to.eql(null)
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
      state = Object.assign({}, defaultState)
      state.graph = graph
    })

    it('moves edge but not node', function() {
      action = { type: 'DRAG_NODE', id: n1.id, deltas: { x: 50, y: 50 } }
      nextState = reducers(state, action)
      expect(nextState.graph.nodes[n1.id].x).to.equal(n1.x)
      expect(nextState.graph.nodes[n1.id].y).to.equal(n1.y)
      expect(nextState.graph.edges[e1.id].x1).to.equal(e1.x1 + 50)
      expect(nextState.graph.edges[e1.id].y1).to.equal(e1.y1 + 50)
      expect(nextState.edgeCreation.nodes).to.eql([])
    })

    it('detects edge creation', function() {
      action = { type: 'DRAG_NODE', id: n1.id, deltas: { x: 0, y: 100 } }
      nextState = reducers(state, action)
      expect(nextState.edgeCreation.nodes).to.eql([n1.id, n3.id])
    })
  })

  describe('MOVE_NODE', function() {
    let state, graph, action, nextState, n1, n2, n3, e1, e2

    beforeEach(function() {
      graph = Graph.new()
      n1 = Node.new({ x: 0, y: 0 })
      n2 = Node.new({ x: 100, y: 0 })
      n3 = Node.new({ x: 0, y: 100 })
      e1 = Edge.newEdgeFromNodes(n1, n2)
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, e1)
      state = Object.assign({}, defaultState)
      state.graph = graph
    })

    it('moves node and its edges when no intersection', function() {
      action = { type: 'MOVE_NODE', id: n1.id, deltas: { x: 50, y: 50 } }
      nextState = reducers(state, action)
      expect(nextState.graph.nodes[n1.id].x).to.equal(n1.x + 50)
      expect(nextState.graph.nodes[n1.id].y).to.equal(n1.y + 50)
      expect(nextState.graph.edges[e1.id].x1).to.equal(e1.x1 + 50)
      expect(nextState.graph.edges[e1.id].y1).to.equal(e1.y1 + 50)
      expect(nextState.edgeCreation.nodes).to.eql([])
    })

    it('creates edge but doesnt move node when intersection dected', function() {
      action = { type: 'MOVE_NODE', id: n1.id, deltas: { x: 0, y: 100 } }
      nextState = reducers(state, action)
      expect(Object.keys(nextState.graph.edges)).to.have.lengthOf(2)
      expect(nextState.graph.nodes[n1.id].x).to.equal(n1.x)
      expect(nextState.graph.nodes[n1.id].y).to.equal(n1.y)
      expect(nextState.graph.edges[e1.id].x1).to.equal(e1.x1)
      expect(nextState.graph.edges[e1.id].y1).to.equal(e1.y1)
      expect(nextState.edgeCreation.nodes).to.eql([])
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

      state = { graph, display: { floatingMenu: { type: 'edge', id: e2.id } } }
      action = { type: 'REMOVE_EDGE', id: e2.id }
      nextState = reducers(state, action)  
    })

    it('removes edge from graph', function() {
      expect(values(nextState.graph.edges)).to.eql([e1])
    })

    it('closes floating menu', function() {
      expect(nextState.display.floatingMenu.type).to.eql(null)
      expect(nextState.display.floatingMenu.id).to.eql(null)
    })
  })
})
