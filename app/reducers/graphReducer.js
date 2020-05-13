import produce from 'immer'
import merge from 'lodash/merge'
import undoable, { includeAction } from 'redux-undo'
import { generate } from 'shortid'

import Graph from '../graph/graph'
import { findIntersectingNodeFromDrag } from '../graph/node'
import Edge from '../graph/edge'
import Caption from '../graph/caption'
import { translatePoint } from '../util/helpers'

let draggedNode, draggedOverNode, newEdge

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
  case 'DRAG_NODE':
    Graph.dragNodeEdges(graph, action.node.id, action.deltas)
    return
  case 'MOVE_NODE':
    draggedNode = graph.nodes[action.id]
    draggedOverNode = findIntersectingNodeFromDrag(
      graph.nodes, 
      draggedNode, 
      action.deltas
    )

    if (draggedOverNode) {
      newEdge = Edge.newEdgeFromNodes(draggedNode, draggedOverNode)
      Graph.addEdge(graph, newEdge)
      Graph.dragNodeEdges(graph, action.id, { x: 0, y: 0 })
    } else {
      Graph.moveNode(graph, action.id, action.deltas)
      Graph.dragNodeEdges(graph, action.id, { x: 0, y: 0 }) // updates node's edges
    }

    return
  case 'ADD_EDGE':
    Graph.addEdgeIfNodes(graph, action.edge)
    return
  case 'ADD_EDGES':
    Graph.addEdgesIfNodes(graph, action.edges)
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
  case 'APPLY_FORCE_LAYOUT':
    return action.graph
  default:
    return
  }
}, null)

export const UNDO_ACTIONS = [
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
  'REMOVE_CAPTION',
  'APPLY_FORCE_LAYOUT'
]

const undoableReducer = undoable(reducer, { 
  filter: includeAction(UNDO_ACTIONS),
  groupBy: (action) => {
    let { type } = action

    // force layouts shouldn't be grouped
    if (type === 'APPLY_FORCE_LAYOUT') {
      type = generate()
    }

    // consider all consecutive drags and moves for the same node as one action
    if (type === 'DRAG_NODE') {
      type = 'MOVE_NODE'
    }

    return type + (action.id ? ("-" + String(action.id)) : "")
  },
  debug: false,
  ignoreInitialState: true,
  syncFilter: true
})

const flattenStateReducer = (graph, action) => {
  // include SET_SVG_ZOOM so that state is flattened at the start
  if (!graph.nodes || UNDO_ACTIONS.concat(['SET_SVG_ZOOM']).includes(action.type)) {
    return { 
      ...graph.present,
      ...graph
    }
  } else {
    return graph
  }
}

export default (state, action) => flattenStateReducer(undoableReducer(state, action), action)