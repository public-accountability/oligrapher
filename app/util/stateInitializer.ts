import merge from 'lodash/merge'
import omit from 'lodash/omit'
import flow from 'lodash/flow'

import defaultState, { StateWithHistory } from './defaultState'
import {
  Graph, NodeMap, EdgeMap, CaptionMap,
  newGraph, calculateViewBoxFromGraph, updateEdgeFromNodes, registerEdgeWithNodes
} from '../graph/graph'
import { Edge, newEdge } from '../graph/edge'
import { Node, newNode } from '../graph/node'
import { Caption, captionDefaults } from '../graph/caption'
import { computeSvgOffset } from './dimensions'
import { userCanEditSelector, paramsForSaveSelector } from './selectors'
import { transformLockData } from './lock'

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

function calculateStoryMode(state: any): boolean {
  const editMode = state.display.modes.editor

  if (editMode) {
    return state.annotations.list.length > 0
  }

  return state.attributes.settings.defaultStoryMode
}

// Handles object for Oligrapher instance configuration
//    - Converts legacy oligrapher data
//    - Performs initial display state calculations,
//    - FIXME and adds graph history
export default function stateInitializer(legacyState: any): State {
  let state = merge({}, defaultState, legacyState)

  state.graph = convertGraph(state.graph)

  state.display.modes.editor = userCanEditSelector(state)
  state.display.viewBox = calculateViewBoxFromGraph(state.graph)
  // state.display.svgOffset = computeSvgOffset(state.display.viewBox)
  state.display.modes.story = calculateStoryMode(state)

  if (legacyState.attributes?.lock) {
    state.attributes.lock = transformLockData(legacyState.attributes.lock)
  }

  // if map has id, it's been saved before, let's keep the data
  // for comparison against current data when user leaves app
  if (legacyState.attributes?.id) {
    state.lastSavedData = paramsForSaveSelector(state)
  }

  return state
}
