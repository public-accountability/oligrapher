import produce from 'immer'
import merge from 'lodash/merge'
import undoable, { includeAction } from 'redux-undo'

import Graph from '../graph/graph'
import Caption from '../graph/caption'
import { translatePoint } from '../util/helpers'

export const reducer = produce((graph, action) => {
  switch(action.type) {
  case 'ADD_NODE':
    Graph.addNode(graph, action.node)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(graph, action.id, action.attributes)
    return
  case 'UPDATE_NODES':
    action.nodeIds.forEach(nodeId => {
      Graph.updateNode(graph, nodeId, action.attributes)
    })
    return
  case 'REMOVE_NODE':
    Graph.removeNode(graph, action.id)
    return
  case 'MOVE_NODE':
    Graph.moveNode(graph, action.id, action.deltas)
    Graph.dragNode(graph, action.id, { x: 0, y: 0 }) // updates node's edges    
    return
  case 'DRAG_NODE':
    Graph.dragNode(graph, action.id, action.deltas)
    return
  case 'ADD_EDGE':
    Graph.addEdgeIfNodes(graph, action.edge)
    return
  case 'ADD_EDGES':
    action.edges.forEach(edge => Graph.addEdgeIfNodes(graph, edge))
    return
  case 'UPDATE_EDGE':
    Graph.updateEdge(graph, action.id, action.attributes)
    return
  // Reserving "DELETE" for future ability to delete data from littlesis backend
  case 'REMOVE_EDGE':
    Graph.removeEdge(graph, action.id)
    return
  case 'ADD_CAPTION':
    Graph.addCaption(graph, merge(
      Caption.fromEvent(action.event, action.zoom), 
      { id: action.id }
    ))
    return
  case 'UPDATE_CAPTION':
    merge(graph.captions[action.id], action.attributes)
    return
  case 'MOVE_CAPTION':
    merge(graph.captions[action.id], translatePoint(graph.captions[action.id], action.deltas))
    return
  case 'REMOVE_CAPTION':
    delete graph.captions[action.id]
    return    
  default:
    return
  }
}, null)

export default undoable(reducer, { 
  filter: includeAction([
    'ADD_NODE',
    'UPDATE_NODE',
    'REMOVE_NODE',
    'DRAG_NODE',
    'MOVE_NODE',
    'ADD_EDGE',
    'ADD_EDGES',
    'UPDATE_EDGE',
    'REMOVE_EDGE',
    'ADD_CAPTION',
    'UPDATE_CAPTION',
    'MOVE_CAPTION',
    'DELETE_CAPTION'
  ]),
  groupBy: (action) => {
    // consider all consecutive drags and moves to the same node as one action
    const type = (action.type === 'DRAG_NODE' ? 'MOVE_NODE' : action.type)
    return type + (action.id ? ("-" + String(action.id)) : "")
  },
  debug: false,
  ignoreInitialState: true,
  syncFilter: true

  // here's a simpler alternative but it will include every incremental drag action
  //
  // filter: (action, currentState, previousHistory) => {
  //   return currentState.graph === previousHistory.present.graph
  // }
})