import curry from 'lodash/curry'
import filter from 'lodash/filter'
import merge from 'lodash/merge'
import produce from 'immer'
import values from 'lodash/values'

const defaultGraph = {
  nodes: {},
  edges: {},
  captions: {}
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

export const moveNode = produce ( (graph, nodeId, delta) => {
  let n = graph.nodes[nodeId]
  graph.nodes[nodeId].x = n.x + delta.x
  graph.nodes[nodeId].y = n.y + delta.y
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
    // These functions stop the api from being able to be chained
    graph:      () => graph,
    edgesOf:    edgesOf(graph),
    // Updates the graph and returns a new copy, still wrapped with api()
    // call .graph() to get the graph
    addNode:    (node) => api(addNode(graph, node)),
    removeNode: (node) => api(removeNode(graph, node)),
    updateNode: (node) => api(updateNode(graph, node)),
    addEdge:    (edge) => api(addEdge(graph, edge)),
    removeEdge: (edge) => api(removeEdge(graph, edge))
  }
}

export function computeViewBox(nodes = [], zoom = 1) {
  const defaultViewBox = { minX: 0, minY: 0,  w: 600, h: 600 }
  const padding = 100

    if (nodes.length === 0) {
    return defaultViewBox
  }

  // Get the X and Y values of all the nodes
  const xValues = nodes.map(n => n.display.x)
  const yValues = nodes.map(n => n.display.y)
  // Calculate the maximum and minimum X/Y values
  const minNodeX = Math.min(...xValues)
  const minNodeY = Math.min(...yValues)
  const maxNodeX = Math.max(...xValues)
  const maxNodeY = Math.max(...yValues)

  // Subtract padding and calculate ViewBox
  const minX = minNodeX - padding
  const minY = minNodeY - padding
  const w = maxNodeX - minNodeX + (padding * 2)
  const h = maxNodeY - minNodeY + (padding * 2)

  const viewBox = { minX, minY, w, h }

  // We can return here if the zoom is 1
  if (zoom === 1) {
    return viewBox
  }

  // Update viewBox according to zoom settings
  const zoomW = w / zoom
  const zoomH = h / zoom
  const zoomMinX = minX + (w / 2) - (zoomW / 2)
  const zoomMinY = minY + (h / 2) - (zoomH / 2)

  return {
    minX: zoomMinX,
    minY: zoomMinY,
    w: zoomW,
    h: zoomH
  }
}

export default {
  "new":        newGraph,
  "api":        api,
  "addNode":    addNode,
  "removeNode": removeNode,
  "updateNode": updateNode,
  "moveNode":   moveNode,
  "addEdge":    addEdge,
  "removeEdge": removeEdge,
  "edgesOf":    edgesOf
}
