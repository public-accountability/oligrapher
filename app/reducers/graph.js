import Graph from '../graph/graph'
import produce from 'immer'

import values from 'lodash/values'
/*

  action.type      |  fields
-------------------|-------------
  SET_ACTUAL_ZOOM  | actualZoom
  ADD_NODE         | node
  ADD_NODES        | nodes
  UPDATE_NODE      | id, attributes
  MOVE_NODE        | id, deltas
  DRAG_NODE        | id, deltas
*/

export default produce( (draft, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    draft.actualZoom = action.actualZoom
    return
  case 'ADD_NODE':
    Graph.addNode(draft, action.node)
    return
  case 'ADD_NODES':
    Graph.addNodes(draft, action.nodes)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(draft, action.id, action.attributes)
    return
  case 'MOVE_NODE':
    Graph.moveNode(draft, action.id, action.deltas)
    return
  case 'DRAG_NODE':
    Graph.moveEdgesOfNode(draft, action.id, action.deltas)
    return
  }
}, null)
