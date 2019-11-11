import filter from 'lodash/filter'
import merge from 'lodash/merge'
import values from 'lodash/values'

const defaultGraph = {
  nodes: {},
  edges: {},
  captions: {}
}

/// helper functions

export function getId(thing) {
  if (typeof thing === 'string') {
    return thing
  } else if (typeof thing === 'object') {
    if (thing.id) {
      return getId(thing.id)
    } else {
      throw new Error("getId() failed: Missing id from object")
    }
  } else if (typeof thing === 'number') {
    return thing.toString()
  } else {
    throw new Error("getId() only accepts Strings, Objects, and numbers")
  }
}

// Create a new graph object
// Available as Graph.new() and typically used to create a new empty graph

export function newGraph(attributes = {}) {
  return merge({}, defaultGraph, attributes)
}

// All of the functions take `graph` as the first argument.
// Most modify the graph object and return it.

// Stats & Getters

const minNodeX = nodes => Math.min(...nodes.map(n => n.display.x))
const minNodeY = nodes => Math.min(...nodes.map(n => n.display.y))
const maxNodeX = nodes => Math.max(...nodes.map(n => n.display.x))
const maxNodeY = nodes => Math.max(...nodes.map(n => n.display.y))

// TODO: Nodes with LittleSis IDs

export function stats(graph) {
  const nodes = values(graph.nodes)

  return {
    nodeCount: nodes.length,
    edgeCount: values(graph.edges).length,
    minNodeX:  minNodeX(nodes),
    minNodeY:  minNodeY(nodes),
    maxNodeX:  maxNodeX(nodes),
    maxNodeY:  maxNodeY(nodes)
  }
}

// Graph Getters

export function edgesOf(graph, node) {
  return filter(
    values(graph.edges),
    edge => edge.node1_id === getId(node) || edge.node2_id === getId(node)
  )
}

export function nodesOf(graph, edge) {
  const nodeIds = [edge.node1_id, edge.node2_id]
  return nodeIds.map(nodeId => graph.nodes[nodeId])
}


// Basic Graph Actions: Adding/Removing Components
// These all return a modifyed graph


export function addNode(graph, node) {
  graph.nodes[getId(node)] = node
  return graph
}

export function addNodes(graph, nodes) {
  nodes.forEach(node => addNode(graph, node))
  return graph
}

export function removeNode(graph, node) {
  delete graph.nodes[getId(node)]
  return graph
}


// Updates the ".display" object of a node.
export function updateNode(graph, node, attributes) {
  merge(graph.nodes[getId(node)].display, attributes)
  return graph
}


export function addEdge(graph, edge) {
  graph.edges[edge.id] = edge
  return graph
}

export function removeEdge(graph, edge) {
  delete graph.edges[getId(edge)]
  return graph
}

// Updates the ".display" object of a edge
export function updateEdge(graph, edge, attributes) {
  merge(graph.edges[getId(edge)].display, attributes)
  return graph
}

// Dragging Functions

export function moveNode(graph, nodeId, deltas) {}
export function moveEdgeNode(graph, nodeId, deltas) {}
export function onNodeDrag(graph, nodeId, deltas) {}
export function onEdgeDrag(graph, edge) {}



// export const updateNode = produce( (graph, node) => {
//   graph.nodes[node.id] = merge(graph.nodes[node.id], node)
// })

// export const addEdge = produce( (graph, edge) => {
//   graph.edges[edge.id] = edge
// })

// export const removeEdge = produce( (graph, edge) => {
//   delete graph.edges[edge.id]
// })

// export const moveNode = produce ( (graph, nodeId, delta) => {
//   let n = graph.nodes[nodeId]
//   graph.nodes[nodeId].x = n.x + delta.x
//   graph.nodes[nodeId].y = n.y + delta.y
// })

// export const edgesOf = curry( (graph, nodeId) => {
//   return filter(
//     values(graph.edges),
//     edge => edge.node1_id === nodeId || edge.node2_id === nodeId
//   )
// })

// export const newGraph = function(attributes = {}) {
//   return merge({}, defaultGraph, attributes)
// }

// export function api(graph) {
//   if (!graph) {
//     graph = newGraph()
//   }

//   return {
//     // These functions stop the api from being able to be chained
//     graph:      () => graph,
//     edgesOf:    edgesOf(graph),
//     // Updates the graph and returns a new copy, still wrapped with api()
//     // call .graph() to get the graph
//     addNode:    (node) => api(addNode(graph, node)),
//     removeNode: (node) => api(removeNode(graph, node)),
//     updateNode: (node) => api(updateNode(graph, node)),
//     addEdge:    (edge) => api(addEdge(graph, edge)),
//     removeEdge: (edge) => api(removeEdge(graph, edge))
//   }
// }

// export function computeViewBox(nodes = [], zoom = 1) {
//   const defaultViewBox = { minX: 0, minY: 0,  w: 600, h: 600 }
//   const padding = 100

//   if (nodes.length === 0) {
//     return defaultViewBox
//   }

//   // Get the X and Y values of all the nodes
//   const xValues = nodes.map(n => n.display.x)
//   const yValues = nodes.map(n => n.display.y)
//   // Calculate the maximum and minimum X/Y values
//   const minNodeX = Math.min(...xValues)
//   const minNodeY = Math.min(...yValues)
//   const maxNodeX = Math.max(...xValues)
//   const maxNodeY = Math.max(...yValues)

//   // Subtract padding and calculate ViewBox
//   const minX = minNodeX - padding
//   const minY = minNodeY - padding
//   const w = maxNodeX - minNodeX + (padding * 2)
//   const h = maxNodeY - minNodeY + (padding * 2)

//   const viewBox = { minX, minY, w, h }

//   // We can return here if the zoom is 1
//   if (zoom === 1) {
//     return viewBox
//   }

//   // Update viewBox according to zoom settings
//   const zoomW = w / zoom
//   const zoomH = h / zoom
//   const zoomMinX = minX + (w / 2) - (zoomW / 2)
//   const zoomMinY = minY + (h / 2) - (zoomH / 2)

//   return {
//     minX: zoomMinX,
//     minY: zoomMinY,
//     w: zoomW,
//     h: zoomH
//   }
// }

export default {
  "new":             newGraph,
  "stats":           stats,
  "addNode":         addNode,
  "addNodes":        addNodes,
  "removeNode":      removeNode,
  "updateNode":      updateNode,
  "addEdge":         addEdge,
  "removeEdge":      removeEdge,
  "updateEdge":      updateEdge
  // "api":        api,
  // "addNode":    addNode,
  // "removeNode": removeNode,
  // "updateNode": updateNode,
  // "moveNode":   moveNode,
  // "addEdge":    addEdge,
  // "removeEdge": removeEdge,
  // "edgesOf":    edgesOf
}
