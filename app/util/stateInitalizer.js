import defaultState from './defaultState'
import Graph from '../graph/graph'
import Edge from '../graph/edge'
import Node from '../graph/node'
// import Curve from '../graph/curve'
import { captionDefaults } from '../graph/caption'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

const keys = Object.keys

/*
  Edges, Nodes, and Captions used to contain a `display` element.
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
  const state = merge({}, defaultState, serializedState)

  keys(state.graph.nodes).forEach(nodeId => {
    state.graph.nodes[nodeId] = Node.new(flatten(state.graph.nodes[nodeId]))
  })

  keys(state.graph.edges).forEach(edgeId => {
    state.graph.edges[edgeId] = Edge.new(flatten(state.graph.edges[edgeId]))
    Graph.registerEdgeWithNodes(state.graph, state.graph.edges[edgeId])
  })

  keys(state.graph.captions).forEach(captionId => {
    state.graph.captions[captionId] = merge({}, captionDefaults, flatten(state.graph.captions[captionId]))
  })

  state.graph = Graph.new(state.graph)
  state.display.viewBox = Graph.calculateViewBox(state.graph)

  return state
}
