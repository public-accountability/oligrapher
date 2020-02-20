import reducers from '../app/reducers'
import Graph from '../app/graph/graph'
import Node from '../app/graph/node'
import Edge from '../app/graph/edge'
import FloatingMenu from '../app/util/floatingMenu'

import values from 'lodash/values'

describe('Display Reducer', function() {
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
          floatingMenu: { type: 'node', id: 'abc' }
        }
      }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action).display.editor) .to.eql({ tool: 'edge' })
    })

    it("clears floatingMenu", function() {
      const state = { 
        display: { 
          editor: { tool: 'node' },
          floatingMenu: { type: 'node', id: 'abc' }
        }
      }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action).display.floatingMenu) .to.eql({ type: null, id: null })
    })

    it("sets floating menu for settings", function(){
      const state = { display: { 
        floatingMenu: { type: null, id: null }, 
        editor: { tool: 'caption' } 
      } }
      const action = { type: 'OPEN_TOOL', item: 'settings'}
      expect(reducers(state, action)) .to.eql({ 
        display: { 
          floatingMenu: { type: 'settings', id: null }, 
          editor: { tool: 'settings' } 
        }
      })
    })
  })

  describe('OPEN_EDIT_NODE_MENU', function() {
    it('set editNode', function() {
      const state = { display : { editor: { tool: 'node' }, floatingMenu: { type: 'edge', id: 'abc' } } }
      const action = { type: 'OPEN_EDIT_NODE_MENU', id: 'xyz'}
      expect(reducers(state, action).display.floatingMenu)
        .to.eql({ type: 'node', id: 'xyz' })
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
