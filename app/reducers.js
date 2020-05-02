import { combineReducers } from 'redux'

import graphReducer from './reducers/graphReducer'
import displayReducer from './reducers/displayReducer'
import attributesReducer from './reducers/attributesReducer'

export default combineReducers({
  graph: graphReducer,
  display: displayReducer,
  attributes: attributesReducer,
  settings: (settings = null) => settings
})

// let intersectedNode, draggedNode, newEdge

// const crossSliceReducer = produce((state, action) => {
//   switch(action.type) {
//   case 'DRAG_NODE':
//     draggedNode = state.graph.present.nodes[action.id]
//     intersectedNode = findIntersectingNodeFromDrag(
//       state.graph.present.nodes, 
//       draggedNode, 
//       action.deltas
//     )

//     if (intersectedNode) {
//       state.display.userMessage = `Create new edge between ${draggedNode.name} and ${intersectedNode.name}`
//     } else {
//       state.display.userMessage = null
//     }

//     return

//   case 'MOVE_NODE':
//     draggedNode = state.graph.present.nodes[action.id]
//     intersectedNode = findIntersectingNodeFromDrag(
//       state.graph.present.nodes, 
//       draggedNode, 
//       action.deltas
//     )

//     if (intersectedNode) {
//       newEdge = Edge.newEdgeFromNodes(draggedNode, intersectedNode)
//       Graph.addEdge(state.graph.present, newEdge)
//       Graph.dragNodeEdges(state.graph.present, action.id, { x: 0, y: 0 })
//       toggleEditor(state.display, 'edge', newEdge.id)
//     } else {
//       Graph.moveNode(state.graph.present, action.id, action.deltas)
//       Graph.dragNodeEdges(state.graph.present, action.id, { x: 0, y: 0 }) // updates node's edges
//     }

//     return

//   default:
//     return
//   }
// }, null)