import merge from 'lodash/merge'
import omit from 'lodash/omit'

import defaultState from './defaultState'
import Graph from '../graph/graph'
import Edge from '../graph/edge'
import Node from '../graph/node'
import { captionDefaults } from '../graph/caption'
import { computeSvgOffset } from './dimensions'

const keys = Object.keys

/*
  Edges, Nodes, and Captions used to contain a `display` element.
  This has been simplified to be a flat object without any nested components.
*/
export function flatten(obj) {
  return merge(omit(obj, 'display'), obj.display)
}

function convertNodes(nodes) {
  return Object.fromEntries(
    keys(nodes).map(id => [
      String(id),
      Node.new(flatten(nodes[id]))
    ])
  )
}

function convertEdges(edges) {
  return Object.fromEntries(
    keys(edges).map(id => [
      String(id),
      Edge.new(flatten(edges[id]))
    ])
  )
}

function convertCaptions(captions) {
  return Object.fromEntries(
    keys(captions).map(id => [
      String(id),
      merge({}, captionDefaults, flatten(captions[id]))
    ])
  )
}

/*
  Transforms oligrapher's serialized state (plain json) into correct format
  and/or converts legacy data.
*/
export default function stateInitalizer(serializedState) {
  let state = merge({}, defaultState, serializedState)

  state.graph = {
    nodes: convertNodes(state.graph.nodes),
    edges: convertEdges(state.graph.edges),
    captions: convertCaptions(state.graph.captions),
    id: String(state.graph.id)
  }

  keys(state.graph.edges).forEach(id => {
    Graph.registerEdgeWithNodes(state.graph, state.graph.edges[id])
  })

  state.display.viewBox = Graph.calculateViewBox(state.graph)
  state.display.svgOffset = computeSvgOffset(state.display.viewBox)

  // for redux-undo
  state.graph = {
    ...state.graph,
    past: [],
    present: Graph.new(state.graph),
    future: []
  }

  return state
}
