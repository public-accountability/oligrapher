import at from 'lodash/at'
import filter from 'lodash/filter'
import merge from 'lodash/merge'
import values from 'lodash/values'
import { xy, xyArray, distance, translatePoint } from '../util/helpers'
import { parseCurveString, moveCurvePoint } from './curve'

const GRAPH_PADDING = 100
const DEFAULT_VIEWBOX = { minX: -200, minY: -200, w: 400, h: 400 }

const DEFAULT_GRAPH = {
  nodes: {},
  edges: {},
  captions: {},
  viewBox: null,
  actualZoom: null,
  zoom: 1
}

/// helper functions

// Allows functions to accpet a NODE or an ID that can either be
// an object with field "ID" or the ID itself.
// For example ` this.graph.nodes[getId(node)] `
// 400, "400", and { id: 400 } all return "400"
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

// const nodePoint = xyArray(node.display)
//   const [ curveStart, _, curveEnd ] = parseCurveString(edge.display.curve)
//   const distanceToStart = distance(...nodePoint.concat(curveStart))
//   const distanceToEnd = distance(...nodePoint.concat(curveEnd))


// Determines if the node at the 'start' or 'end' of curve
export function nodeSide({node, edge}) {
  let side = (edge.node1_id == node.id) ? 'START' : 'END'

  if (edge.display.isReverse) {
    if (side === 'START') {
      return 'END'
    } else {
      return 'START'
    }
  } else {
    return side
  }
}
// All of the functions take `graph` as the first argument.
// Unless the function is derriving state, all these functions mutate `graph`

// Stats, Getters, and Calculations

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

// output: { minX, minY, w, h }
// These values are used to create the viewBox attribute for the outermost SVG
// Unless we are zoomed in or out, it the extent is a box + padding where
// all the nodes are visible
export function calculateViewBox(graph) {
  const zoom = graph.zoom
  const graphStats = stats(graph)

  if (graphStats.nodeCount === 0) {
    return DEFAULT_VIEWBOX
  }

  const minX = graphStats.minNodeX - GRAPH_PADDING
  const minY = graphStats.minNodeY - GRAPH_PADDING
  const w = (graphStats.maxNodeX - graphStats.minNodeX) + (GRAPH_PADDING * 2)
  const h = (graphStats.maxNodeY - graphStats.minNodeY) + (GRAPH_PADDING * 2)

  // We can return here if the zoom is 1
  if (zoom === 1) {
    return { minX, minY, w, h }
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

// Graph Getters

export function edgesOf(graph, node) {
  return filter(
    values(graph.edges),
    edge => edge.node1_id == getId(node) || edge.node2_id == getId(node)
  )
}

export function nodesOf(graph, edge) {
  const nodeIds = at(graph.edges[getId(edge)], ['node1_id', 'node2_id'])
  return nodeIds.map(nodeId => graph.nodes[nodeId])
}


// Basic Graph Actions: Adding/Removing Components
// These all *mutate* graph and then it

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

export function addEdges(graph, edges) {
  edges.forEach(edge => addEdge(graph, edge))
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

// Updates the associated
export function moveEdgesOfNode(graph, nodeId, deltas) {
  const node = graph.nodes[getId(nodeId)]

  edgesOf(graph, node).forEach(edge => {
    const side = nodeSide({node, edge})
    const newCurveString = moveCurvePoint(edge.display.curve, side, deltas)
    graph.edges[edge.id].display.curve = newCurveString
  })
  return graph
}


// Moves a node to new position,
// transforming the deltas according to `graph.actualZoom`
export function moveNode(graph, node, deltas) {
  const id = getId(node)
  const currentPosition = xy(graph.nodes[id].display)
  const newPosition = translatePoint(currentPosition, deltas)
  merge(graph.nodes[id].display, newPosition)
  return graph
}

export function dragNode(graph, nodeId, deltas) {}
export function dragEdge(graph, edge) {}


// View Box
export function updateViewBox(graph) {
  graph.viewBox = calculateViewBox(graph)
  return graph
}

// Zoom

export function setZoom(graph, zoomLevel) {
  throw new Error("Not Yet Implemented")
}


// Create a new graph object
// Available as Graph.new() and typically used to create a new empty graph

export function newGraph(attributes = {}) {
  let g = merge({}, DEFAULT_GRAPH, attributes)
  updateViewBox(g)
  return g
}



export default {
  "new":               newGraph,
  "stats":             stats,
  "edgesOf":           edgesOf,
  "nodesOf":           nodesOf,
  "calculateViewBox":  calculateViewBox,
  "addNode":           addNode,
  "addNodes":          addNodes,
  "removeNode":        removeNode,
  "updateNode":        updateNode,
  "addEdge":           addEdge,
  "addEdges":          addEdges,
  "removeEdge":        removeEdge,
  "updateEdge":        updateEdge,
  "moveNode":          moveNode,
  "moveEdgesOfNode":   moveEdgesOfNode,
  "dragNode":          dragNode,
  "dragEdge":          dragEdge,
  "updateViewBox":     updateViewBox,
  "setZoom":           setZoom
}
