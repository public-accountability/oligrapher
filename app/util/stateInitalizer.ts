import merge from 'lodash/merge'
import omit from 'lodash/omit'
import flow from 'lodash/flow'

import defaultState, { StateWithHistory } from './defaultState'
import { 
  Graph, NodeMap, EdgeMap, CaptionMap,
  newGraph, calculateViewBox, updateEdgeFromNodes, registerEdgeWithNodes 
} from '../graph/graph'
import { Edge, newEdge } from '../graph/edge'
import { Node, newNode } from '../graph/node'
import { Caption, captionDefaults } from '../graph/caption'
import { computeSvgOffset } from './dimensions'
import { userCanEditSelector } from './selectors'

/*
  Edges, Nodes, and Captions used to contain a `display` element.
  This has been simplified to be a flat object without any nested components.
*/
export function flatten(obj: any): Node | Edge {
  return merge(omit(obj, 'display'), obj.display)
}

function idToString<T extends Node | Edge | Caption>(obj: T): T {
  return merge(obj, { id: String(obj.id) })
}

function convertEdgeAttributes(obj: Edge): Edge {
  return merge(obj, {
    node1_id: String(obj.node1_id),
    node2_id: String(obj.node2_id),
    arrow: Boolean(obj.arrow),
    dash: Boolean(obj.dash)
  })
}

function convertNodes(nodes: NodeMap): NodeMap {
  return Object.fromEntries(
    Object.entries(nodes).map(([id, node]) => [
      String(id),
      newNode(idToString(flatten(node)))
    ])
  )
}

function convertEdges(edges: EdgeMap): EdgeMap {
  const convertEdge = flow(flatten, convertEdgeAttributes, idToString)
  return Object.fromEntries(
    Object.entries(edges).map(([id, edge]) => [
      String(id),
      newEdge(convertEdge(edge)) as Edge
    ])
  )
}

function convertCaptions(captions: CaptionMap): CaptionMap {
  return Object.fromEntries(
    Object.entries(captions).map(([id, caption]) => [
      String(id),
      merge({}, captionDefaults, idToString(flatten(caption))) as Caption
    ])
  )
}

function convertGraph(graph: { nodes: any, edges: any, captions: any }): Graph {
  let newGraph = {
    nodes: convertNodes(graph.nodes),
    edges: convertEdges(graph.edges),
    captions: convertCaptions(graph.captions)
  }

  Object.keys(newGraph.edges).forEach(id => {
    registerEdgeWithNodes(newGraph, id)
    updateEdgeFromNodes(newGraph, id)
  })

  return newGraph
}

/*
  Converts legacy oligrapher data, performs initial display state calculations,
  and adds graph history.
*/
export default function stateInitalizer(legacyState: any): StateWithHistory {
  let state = merge({}, defaultState, legacyState)

  state.graph = convertGraph(state.graph)

  state.display.modes.editor = userCanEditSelector(state)
  state.display.viewBox = calculateViewBox(state.graph)
  state.display.svgOffset = computeSvgOffset(state.display.viewBox)

  // for redux-undo
  state.graph = {
    ...state.graph,
    past: [],
    present: newGraph(state.graph),
    future: []
  }

  return state
}