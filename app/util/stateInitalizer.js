import defaultState from './defaultState'
import Graph from '../graph/graph'
// import Curve from '../graph/curve'

import merge from 'lodash/merge'
import omit from 'lodash/omit'


/*
  Edge and Node used to contain a `display` element.
  This has been simplified to be a flat object without any nested components.
*/
export function flatten(obj) {
  return merge(omit(obj, 'display'), obj.display)
}

// // Oligrapher 2 used to store these properties: { cx, cy, x1, y1, x2, y2, s1, s2 } on the `display` elements.
// // It was replaced with the `curve` and `isReverse` field
// function transformEdge(legacyEdge) {
//   // return early if already in new format
//   if (legacyEdge.display.curve) {
//     return legacyEdge
//   }
//   const geometry = Curve.util.calculateGeometry(legacyEdge.display)
//   const curve = Curve.from.geometry(geometry)
//   const isReverse = geometry.is_reverse

//   return merge(
//     pick(legacyEdge, ['id', 'node1_id', 'node2_id']),
//     { display: pick(legacyEdge.display, ['status', 'label', 'scale', 'arrow', 'dash', 'url']) },
//     { display: { curve, isReverse } }
//   )
// }

/*
  Transforms oligrapher's serialized state (plain json) into correct format
  and/or converts legacy data.

*/
export default function stateInitalizer(serializedState) {
  let state = merge({}, defaultState, serializedState)

  Object.keys(state.graph.edges).forEach(edgeId => {
    let edge = state.graph.edges[edgeId]
    state.graph.edges[edge.id] = flatten(edge)
  })

  Object.keys(state.graph.nodes).forEach(nodeId => {
    let node = state.graph.nodes[nodeId]
    state.graph.nodes[node.id] = flatten(node)
  })

  state.graph = Graph.new(state.graph)
  return state
}
