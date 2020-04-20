import at from 'lodash/at'
import filter from 'lodash/filter'
import isNumber from 'lodash/isNumber'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import values from 'lodash/values'
import pick from 'lodash/pick'

import { translatePoint, rotatePoint, distance } from '../util/helpers'
import { newNode } from './node'
import { edgeCoordinates, newEdgeFromNodes } from './edge'
import { calculateGeometry } from './curve'

import nodeDisplaySetting from '../NodeDisplaySettings'

export const GRAPH_PADDING = 100
const DEFAULT_VIEWBOX = { minX: -200, minY: -200, w: 400, h: 400 }

const DEFAULT_GRAPH = {
  nodes: {},
  edges: {},
  captions: {},
  viewBox: null,
  actualZoom: null,
  zoom: 1
}


/*
    - Helper Functions
    - Stats & Getters
    - ViewBox Calculations
    - Graph Functions
    - Dragging
    - Add Connections
*/


/// Helper Functions  //

// Allows functions to accept a node object or an id.
// For example: 400, "400", and { id: 400 } all return "400"
// Often used like this: ` this.graph.nodes[getId(node)] `
export function getId(thing) {
  if (typeof thing === 'string') {
    return thing
  } else if (typeof thing === 'object') {
    if (thing.id) {
      return getId(thing.id)
    } else {
      throw new Error("getId() failed: the object does not have the property 'id'")
    }
  } else if (typeof thing === 'number') {
    return thing.toString()
  } else if (typeof thing === 'undefined') {
    throw new Error("getId() called with an undefined argument")
  } else {
    throw new Error("getId() only accepts Strings, Objects, and numbers")
  }
}

// Which node (node 1 or node 2) is the node of the edge -- can be either 1 or 2
export function determineNodeNumber({edge, node}) {
  const nodeId = getId(node)

  if (edge.node1_id.toString() === nodeId) {
    return 1
  } else if (edge.node2_id.toString() === nodeId) {
    return 2
  } else {
    throw new Error("Edge is not connected to the node")
  }
}



function edgeAngle(edge) {
  Math.atan2(edge.y2 - edge.y1, edge.x2 - edge.x1)
}

// Stats, Getters, and Calculations

const minNodeX = nodes => Math.min(...nodes.map(n => n.x))
const minNodeY = nodes => Math.min(...nodes.map(n => n.y))
const maxNodeX = nodes => Math.max(...nodes.map(n => n.x))
const maxNodeY = nodes => Math.max(...nodes.map(n => n.y))

// TODO: Nodes with LittleSis IDs

export function stats(graph) {
  const nodes = values(graph.nodes)

  return {
    nodeCount: nodes.length,
    edgeCount: values(graph.edges).length,
    minNodeX: minNodeX(nodes),
    minNodeY: minNodeY(nodes),
    maxNodeX: maxNodeX(nodes),
    maxNodeY: maxNodeY(nodes)
  }
}

export const getNode = (graph, nodeId) => graph.nodes[getId(nodeId)]
export const getEdge = (graph, edgeId) => graph.edges[getId(edgeId)]

export function edgesOf(graph, node) {
  return filter(
    values(graph.edges),
    edge => edge.node1_id == getId(node) || edge.node2_id == getId(node)
  )
}

export function nodesOf(graph, edge) {
  return at(graph.edges[getId(edge)], ['node1_id', 'node2_id']).map(nodeId => graph.nodes[nodeId])
}


// ViewBox Calculations

// output: { minX, minY, w, h }
// These values are used to create the viewBox attribute for the outermost SVG,
// which is effectively the smallest rectangle that can be fit around all nodes.
export function calculateViewBox(graph) {
  // const zoom = graph.zoom
  const graphStats = stats(graph)

  if (graphStats.nodeCount === 0) {
    return DEFAULT_VIEWBOX
  }``

  const minX = graphStats.minNodeX - GRAPH_PADDING
  const minY = graphStats.minNodeY - GRAPH_PADDING
  const w = (graphStats.maxNodeX - graphStats.minNodeX) + (GRAPH_PADDING * 2)
  const h = (graphStats.maxNodeY - graphStats.minNodeY) + (GRAPH_PADDING * 2)

  return { minX, minY, w, h }
}

// Returns the geometric center point of a graph's viewbox
export function calculateCenter(graph) {
  const vb = calculateViewBox(graph)
  const x = vb.minX + (vb.w / 2)
  const y = vb.minY + (vb.h / 2)
  return { x, y }
}

// Tries to find position near a position on a graph not intersecting a node,
// starting at the center and incrementally expanding the search radius.
export function findFreePositionNear(graph, startPosition) {
  const padding = 50
  const maxTries = 30
  let position, node, success = false, tries = 0, radius = 0

  do {
    position = positionNear(startPosition, radius)
    node = intersectingNode(graph, position, null, padding)
    success = (node === undefined)
    tries += 1
    radius += 20
  } while (!success && tries < maxTries)

  return success ? position : startPosition
}

// Picks random position within a radius of another position
export function positionNear({ x, y }, radius) {
  const angle = Math.random() * Math.PI
  const xOffset = Math.random() * radius * Math.cos(angle)
  const yOffset = Math.random() * radius * Math.sin(angle)

  return { x: Math.floor(x + xOffset), y: Math.floor(y + yOffset) }
}

// Graph Functions
// All of these functions take `graph` as the first argument
//
// Note that many of these functions will mutate `graph`.

// Creates a new, empty graph object
// exported in the module default as Graph.new
export function newGraph(attributes = {}) {
  let g = merge({}, DEFAULT_GRAPH, attributes)
  return g
}

export function addNode(graph, attributes, callback = null) {
  let node = newNode(attributes)

  // Place the node at random spaced position near the graph center, 
  // unless coordinates are provided
  if (!(isNumber(node.x) && isNumber(node.y))) {
    merge(node, findFreePositionNear(graph, calculateCenter(graph)))
  }

  graph.nodes[getId(node)] = node
  
  // So that the outer scope can access the node that was just added 
  // in case it didn't already have an id
  if (callback) {
    callback(node)
  }
  
  return graph
}

export function addNodes(graph, nodes) {
  nodes.forEach(node => addNode(graph, node))
  return graph
}

export function removeNode(graph, node) {
  edgesOf(graph, node).forEach(edge => removeEdge(graph, edge))
  delete graph.nodes[getId(node)]
  return graph
}

export function updateNode(graph, node, attributes) {
  merge(graph.nodes[getId(node)], attributes)

  // If scale is changed, update any associated edges
  if (attributes.scale) {
    edgesOf(graph, getId(node)).forEach(edge => {
      let attribute = 's' + determineNodeNumber({edge, node})
      graph.edges[edge.id][attribute] = attributes.scale
    })
  }

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

export function addEdgeIfNodes(graph, edge) {
  if (getEdge(graph, edge.id)) {
    return graph
  }

  let node1 = getNode(graph, edge.node1_id)
  let node2 = getNode(graph, edge.node2_id)

  if (!node1 || !node2) {
    return graph
  }

  return addEdge(graph, newEdgeFromNodes(node1, node2, edge))
}

export function removeEdge(graph, edge) {
  delete graph.edges[getId(edge)]
  return graph
}

export function updateEdge(graph, edge, attributes) {
  merge(graph.edges[getId(edge)], attributes)
  return graph
}

export function addCaption(graph, caption) {
  graph.captions[caption.id] = caption
  return graph
}

// Dragging

// Moves a node to new position,
export function moveNode(graph, node, deltas) {
  const newPosition = translatePoint(getNode(graph, node), deltas)
  merge(graph.nodes[getId(node)], newPosition)
  return graph
}

// See `Graph.moveEdgeNode` in legacy code
export function updateEdgeOffset(oldEdge, newEdge) {
  const deltaAngle = edgeAngle(newEdge) - edgeAngle(oldEdge)
  const geometry = calculateGeometry(oldEdge)
  const rotatedPoint = rotatePoint({x: geometry.cx, y: geometry.cy }, deltaAngle)
  return {...newEdge, cx: rotatedPoint.x, cy: rotatedPoint.cy }
}

// This updates an edge's curve when one of it's nodes has moved
export function dragNodeEdge(graph, {edge, node, coordinates}) {
  merge(graph.edges[edge.id],
        edgeCoordinates(determineNodeNumber({ edge, node }), coordinates))
  return graph
}

// dragNode() updates the connected edges (if any)
// It does not change the coordinates of the node that is dragging.
export function dragNode(graph, nodeId, deltas) {
  const node = getNode(graph, nodeId)
  const coordinates = translatePoint(node, deltas) // x,y of location of new node
  edgesOf(graph, node.id).forEach(edge => dragNodeEdge(graph, {edge, node, coordinates}))
  return graph
}

// {x,y}, {x,y} ---> Boolean
function intersects(coordinates, node, padding = 20) {
  const radius = (nodeDisplaySetting.circleRadius * node.scale) + padding
  return distance(node, coordinates) <= radius
}

// Returns the intersecting node (including a hard-coded buffer radius)
// If there are no intersections, this returns undefined
export function intersectingNode(graph, coordinates, selfId = null, padding = 20) {
  return values(omit(graph.nodes, selfId)).find(node => intersects(coordinates, node, padding))
}

export function intersectingNodeFromDrag(graph, nodeId, deltas) {
  return intersectingNode(
    graph,
    translatePoint(getNode(graph, nodeId), deltas),
    nodeId
  )
}

// Add Connections

function addConnection(graph, { existingNodeId, newNode, newEdge }) {
  if (getEdge(graph, newEdge.id)) {
    return
  }

  if (!getNode(graph, newNode.id)) {
    addNode(graph, pick(newNode, ['id', 'name', 'url', 'image']))
  }

  const node1Id = newEdge.node1_id == existingNodeId ? existingNodeId : newNode.id
  const node2Id = newEdge.node1_id == existingNodeId ? newNode.id : existingNodeId

  const edge = newEdgeFromNodes(
    getNode(graph, node1Id),
    getNode(graph, node2Id),
    pick(newEdge, ['id', 'label', 'url', 'arrow', 'dash'])
  )

  addEdge(graph, edge)

  return graph
}

function connectedNodeIds(graph, node) {
  let nodeIds = edgesOf(graph, node).map(edge => [edge.node1_id, edge.node2_id]).flat()
  return [...new Set(nodeIds)].filter(id => id != node.id)
}

function arrangeGraph(graph, arrangement) {
  if (!['circle', 'lines'].includes(arrangement)) {
    throw new Error(`invalid graph arrangement: ${arrangement}`)
  }

  return graph
}

export default {
  "new": newGraph,
  "stats": stats,
  "edgesOf": edgesOf,
  "nodesOf": nodesOf,
  "getNode": getNode,
  "getEdge": getEdge,
  "calculateViewBox": calculateViewBox,
  "addNode": addNode,
  "addNodes": addNodes,
  "removeNode": removeNode,
  "updateNode": updateNode,
  "addEdge": addEdge,
  "addEdges": addEdges,
  "addEdgeIfNodes": addEdgeIfNodes,
  "removeEdge": removeEdge,
  "updateEdge": updateEdge,
  "addCaption": addCaption,
  "moveNode": moveNode,
  "dragNode": dragNode,
  "intersectingNode": intersectingNode,
  "intersectingNodeFromDrag": intersectingNodeFromDrag,
  "addConnection": addConnection,
  "connectedNodeIds": connectedNodeIds,
  "arrange": arrangeGraph
}
