import produce from 'immer'
import merge from 'lodash/merge'
import undoable, { includeAction } from 'redux-undo'
import { nanoid } from 'nanoid/non-secure'

import {
  Graph, addNode, updateNode, removeNode, removeNodes, dragNodeEdges, moveNode,
  addEdge, addEdgeIfNodes, addEdgesIfNodes, updateEdge, removeEdge,
  addCaption, addInterlocks
} from '../graph/graph'
import { findIntersectingNodeFromDrag } from '../graph/node'
import Edge from '../graph/edge'
import Caption from '../graph/caption'
import { translatePoint } from '../util/geometry'
import { GraphState } from '../util/defaultState'

export const reducer = produce((graph: Graph, action: any): void => {
  switch(action.type) {
  case 'ADD_NODE':
    addNode(graph, action.node, action.position || true)
    return
  case 'UPDATE_NODE':
    updateNode(graph, action.id, action.attributes)
    return
  case 'UPDATE_NODES':
    action.nodeIds.forEach((nodeId: string) => {
      updateNode(graph, nodeId, action.attributes)
    })
    return
  case 'REMOVE_NODE':
    removeNode(graph, action.id)
    return
  case 'REMOVE_NODES':
    removeNodes(graph, action.ids)
    return
  case 'DRAG_NODE':
    dragNodeEdges(graph, action.id, action.deltas)
    return
  case 'DRAG_NODES':
    action.nodeIds.forEach((id: string) => dragNodeEdges(graph, id, action.deltas))
    return
  case 'MOVE_NODE':
    moveNode(graph, action.id, action.deltas)
    return
  case 'MOVE_NODES':
    action.nodeIds.forEach((id: string) => moveNode(graph, id, action.deltas))
    return
  case 'ADD_EDGE':
    addEdgeIfNodes(graph, action.edge)
    dragNodeEdges(graph, action.id, { x: 0, y: 0 })
    return
  case 'ADD_EDGES':
    addEdgesIfNodes(graph, action.edges)
    return
  case 'UPDATE_EDGE':
    updateEdge(graph, action.id, action.attributes)
    return
  // Reserving "DELETE" for future ability to delete data from littlesis backend
  case 'REMOVE_EDGE':
    removeEdge(graph, action.id)
    return
  case 'ADD_CAPTION':
    addCaption(graph, merge(
      Caption.fromEvent(action.event),
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
  case 'INTERLOCKS_SUCCESS':
    addInterlocks(graph, action.node1Id, action.node2Id, action.nodes, action.edges)
    return
  default:
    return
  }
}, null)

export const UNDO_ACTIONS = [
  'ADD_NODE',
  'UPDATE_NODE',
  'UPDATE_NODES',
  'REMOVE_NODE',
  'DRAG_NODE',
  'DRAG_NODES',
  'MOVE_NODE',
  'MOVE_NODES',
  'ADD_EDGE',
  'ADD_EDGES',
  'UPDATE_EDGE',
  'REMOVE_EDGE',
  'ADD_CAPTION',
  'UPDATE_CAPTION',
  'MOVE_CAPTION',
  'REMOVE_CAPTION',
  'APPLY_FORCE_LAYOUT',
  'REMOVE_NODES'
]

const undoableReducer = undoable(reducer, {
  filter: includeAction(UNDO_ACTIONS),
  groupBy: (action) => {
    let actionType = action.type

    // force layouts shouldn't be grouped
    if (actionType === 'APPLY_FORCE_LAYOUT') {
      actionType = nanoid()
    }

    // consider all consecutive drags and moves for the same node(s) as one action
    if (actionType === 'DRAG_NODE') {
      actionType = 'MOVE_NODE'
    }

    if (actionType === 'ADD_EDGE') {
      actionType = 'MOVE_NODE'
    }

    if (actionType == 'DRAG_NODES') {
      actionType = 'MOVE_NODES'
    }

    let ids = action.nodeIds ? action.nodeIds.join(',') : action.id

    return actionType + (ids ? ("-" + String(ids)) : "")
  },
  debug: false,
  ignoreInitialState: true,
  syncFilter: true
})

const flattenStateReducer = (graph: GraphState, action: any) => {
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

export default (state: GraphState, action: any) => flattenStateReducer(undoableReducer(state, action), action)
