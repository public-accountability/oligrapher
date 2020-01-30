import produce from 'immer'
import isEqual from 'lodash'

import Graph from './graph/graph'
import Edge from './graph/edge'
import Caption from './graph/caption'

const ZOOM_INTERVAL = 0.2

const  checkOpenTool = (current, required) => {
  if (isEqual(current, required)) { return true }
  console.error('Correct tool is not open.')
  return false
}

/*

  action.type         |  fields
----------------------|-------------
  SET_ACTUAL_ZOOM     | actualZoom
  ZOOM                | direction
  ADD_NODE            | attributes
  ADD_NODES           | nodes
  UPDATE_NODE         | id, attributes
  MOVE_NODE           | id, deltas
  DRAG_NODE           | id, deltas
  UPDATE_EDGE         | id, attributes
  ADD_CAPTION         | event
  SET_MODE            | mode, enabled
  OPEN_TOOL           | item
  OPEN_EDIT_NODE_MENU | id
  OPEN_EDIT_EDGE_MENU | id
  UPDATE_ATTRIBUTE    | name, value
*/


export default produce( (draft, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    draft.graph.actualZoom = action.actualZoom
    return
  case 'ADD_NODE':
    Graph.addNode(draft.graph, action.attributes)
    return
  case 'ADD_NODES':
    Graph.addNodes(draft.graph, action.nodes)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(draft.graph, action.id, action.attributes)
    return
  case 'MOVE_NODE':
    if (action.editorTool === 'node') {
      Graph.dragNode(draft.graph, action.id, action.deltas)
      Graph.moveNode(draft.graph, action.id, action.deltas)
    }

    // The is the drag to create edges feature:
    if (action.editorTool === 'edge') {
      let node1 = Graph.getNode(draft.graph, action.id)
      let node2 = Graph.intersectingNodeFromDrag(draft.graph, action.id, action.deltas)

      if (node2) {
        Graph.addEdge(draft.grpah, Edge.newEdgeFromNodes(node1, node2))
      }
    }
    return
  case 'DRAG_NODE':
    if (action.editorTool === 'node') {
      Graph.dragNode(draft.graph, action.id, action.deltas)
    }

    if (action.editorTool === 'edge') {
      // Display message about which node will be connected ?
    }

    return
  case 'UPDATE_EDGE':
    Graph.updateEdge(draft.graph, action.id, action.attributes)
    return
  case 'NEW_CAPTION':
    Graph.addCaption(draft.graph, Caption.fromEvent(action.event, draft.zoom))
    return
  case 'ZOOM':
    if (action.direction === 'IN') {
      draft.graph.zoom = draft.graph.zoom + ZOOM_INTERVAL
    } else if (action.direction === 'OUT') {
      draft.graph.zoom = draft.graph.zoom - ZOOM_INTERVAL
    }
    return
  case 'SET_MODE':
    draft.display.modes[action.mode] = action.enabled
    return
  case 'OPEN_TOOL':
    draft.display.editor.tool = action.item

    if (action.item != 'node') {
      draft.display.editor.editNode = null  // Reset the selected node
    }
    return
  case 'OPEN_EDIT_NODE_MENU':
    if (checkOpenTool(draft.display.editor.tool, 'node')) {
      draft.display.editor.editNode = action.id
    }
    return
  case 'OPEN_EDIT_EDGE_MENU':
    if (checkOpenTool(draft.display.editor.tool, 'edge')) {
      draft.display.editEdge = action.id
    }
    return
  case 'UPDATE_ATTRIBUTE':

    if (!['title', 'subtitle'].includes(action.name)) {
      throw new Error(`Unknown attribute: ${action.name}`)
    }

    draft.attributes[action.name] = action.value
    return
  default:
    return
  }
}, null)


// export default combineReducers({
//   graph,
//   display,
//   selection,
//   settings,
//   hooks,
//   attributes
// })
