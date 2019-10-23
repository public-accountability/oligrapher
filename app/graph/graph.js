import clone from 'lodash/clone'
import curry from 'lodash/curry'
import values from 'lodash/values'
import filter from 'lodash/filter'
import merge from 'lodash/merge'
import produce from 'immer'

const defaultGraph = {
  nodes: {},
  edges: {},
  captions: {},
  annotations: [],
  zoom: 1,
  center: [0, 0]
}

export const addNode = produce( (graph, node) => {
  graph.nodes[node.id] = node
})

export const removeNode = produce( (graph, node) => {
  delete graph.nodes[node.id]
})

export const updateNode = produce( (graph, node) => {
  graph.nodes[node.id] = merge(graph.nodes[node.id], node)
})

export const addEdge = produce( (graph, edge) => {
  graph.edges[edge.id] = edge
})

export const removeEdge = produce( (graph, edge) => {
  delete graph.edges[edge.id]
})

export const edgesOf = curry( (graph, nodeId) => {
  return filter(
    values(graph.edges),
    edge => edge.node1_id === nodeId || edge.node2_id === nodeId
  )
})

export const newGraph = function(attributes = {}) {
  return merge({}, defaultGraph, attributes)
}

export function api(graph) {
  if (!graph) {
    graph = newGraph()
  }

  return {
    graph:      () => graph,
    addNode:    (node) => api(addNode(graph, node)),
    removeNode: (node) => api(removeNode(graph, node)),
    updateNode: (node) => api(updateNode(graph, node)),
    addEdge:    (edge) => api(addEdge(graph, edge)),
    removeEdge: (edge) => api(removeEdge(graph, edge)),
    edgesOf:    edgesOf(graph)
  }
}

export default {
  "new":        newGraph,
  "api":        api,
  "addNode":    addNode,
  "removeNode": removeNode,
  "updateNode": updateNode,
  "addEdge":    addEdge,
  "removeEdge": removeEdge,
  "edgesOf":    edgesOf
}
