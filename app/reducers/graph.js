import produce from 'immer'

import Graph from '../graph/graph'
import Edge from '../graph/edge'
import Caption from '../graph/caption'

const ZOOM_INTERVAL = 0.2
/*

  action.type      |  fields
-------------------|-------------
  SET_ACTUAL_ZOOM  | actualZoom
  ZOOM             | direction
  ADD_NODE         | attributes
  ADD_NODES        | nodes
  UPDATE_NODE      | id, attributes
  MOVE_NODE        | id, deltas
  DRAG_NODE        | id, deltas
  UPDATE_EDGE      | id, attributes
  ADD_CAPTION      | event
*/

export default produce( (draft, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    console.log('ACTUAL ZOOM value is', action.actualZoom)
    draft.actualZoom = action.actualZoom
    return
  case 'ADD_NODE':
    Graph.addNode(draft, action.attributes)
    return
  case 'ADD_NODES':
    Graph.addNodes(draft, action.nodes)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(draft, action.id, action.attributes)
    return
  case 'MOVE_NODE':
    if (action.editorTool === 'node') {
      Graph.dragNode(draft, action.id, action.deltas)
      Graph.moveNode(draft, action.id, action.deltas)
    }

    // The is the drag to create edges feature:
    if (action.editorTool === 'edge') {
      let node1 = Graph.getNode(draft, action.id)
      let node2 = Graph.intersectingNodeFromDrag(draft, action.id, action.deltas)

      if (node2) {
        Graph.addEdge(draft, Edge.newEdgeFromNodes(node1, node2))
      }
    }
    return
  case 'DRAG_NODE':

    if (action.editorTool === 'node') {
      Graph.dragNode(draft, action.id, action.deltas)
    }

    if (action.editorTool === 'edge') {
      // Display message about which node will be connected ?
    }

    return
  case 'UPDATE_EDGE':
    Graph.updateEdge(draft, action.id, action.attributes)
    return
  case 'NEW_CAPTION':
    Graph.addCaption(draft, Caption.fromEvent(action.event, draft.zoom))
    return
  case 'ZOOM':
    switch(action.direction) {
    case 'IN':
      draft.zoom = draft.zoom + ZOOM_INTERVAL
      break
    case 'OUT':
      draft.zoom = draft.zoom - ZOOM_INTERVAL
      break
    }
    return
  }
}, null)
