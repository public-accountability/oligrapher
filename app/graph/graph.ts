import at from 'lodash/at'
import isNumber from 'lodash/isNumber'
import merge from 'lodash/merge'
import values from 'lodash/values'
import pick from 'lodash/pick'
// @ts-ignore
import Springy from 'springy'

import { Point, translatePoint, rotatePoint } from '../util/geometry'
import { Node, NodeAttributes, newNode, findIntersectingNode } from './node'
import { Edge, EdgeAttributes, edgeCoordinates, newEdgeFromNodes } from './edge'
import { Caption } from './caption'
import { calculateGeometry, defaultCurveStrength } from './curve'

export interface NodeMap {
  [key: string]: Node
}

export interface EdgeMap {
  [key: string]: Edge
}

export interface CaptionMap {
  [key: string]: Caption
}

export interface Graph {
  nodes: NodeMap,
  edges: EdgeMap,
  captions: CaptionMap
}

export interface GraphAttributes {
  nodes?: NodeMap,
  edges?: EdgeMap,
  captions?: CaptionMap
}

export interface EdgeIndex {
  [key: string]: { [key: string]: Array<Edge> }
}

export interface Viewbox {
  minX: number,
  minY: number,
  w: number,
  h: number
}

export const GRAPH_PADDING_X = 150
export const GRAPH_PADDING_Y = 50
const DEFAULT_VIEWBOX: Viewbox = { minX: -500, minY: -400, w: 1000, h: 800 }

const DEFAULT_GRAPH: Graph = {
  nodes: {},
  edges: {},
  captions: {}
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
// export function getId(thing: { id?: string } | number | string): string {
//   if (typeof thing === 'string') {
//     return thing
//   } else if (typeof thing === 'object') {
//     if (thing.id) {
//       return getId(thing.id)
//     } else {
//       throw new Error("getId() failed: the object does not have the property 'id'")
//     }
//   } else if (typeof thing === 'number') {
//     return thing.toString()
//   } else if (typeof thing === 'undefined') {
//     throw new Error("getId() called with an undefined argument")
//   } else {
//     throw new Error("getId() only accepts Strings, Objects, and numbers")
//   }
// }

// Which node (node 1 or node 2) is the node of the edge -- can be either 1 or 2
export function determineNodeNumber(edge: Edge, nodeId: string): number {
  if (edge.node1_id === nodeId) {
    return 1
  } else if (edge.node2_id === nodeId) {
    return 2
  } else {
    throw new Error("Edge is not connected to the node")
  }
}


// Stats, Getters, and Calculations

const minNodeX = (nodes: Array<Node>): number => Math.min(...nodes.map(n => n.x))
const minNodeY = (nodes: Array<Node>): number => Math.min(...nodes.map(n => n.y))
const maxNodeX = (nodes: Array<Node>): number => Math.max(...nodes.map(n => n.x))
const maxNodeY = (nodes: Array<Node>): number => Math.max(...nodes.map(n => n.y))

const minCaptionX = (captions: Array<Caption>): number => Math.min(0, ...captions.map(c => c.x))
const minCaptionY = (captions: Array<Caption>): number => Math.min(0, ...captions.map(c => c.y))
const maxCaptionX = (captions: Array<Caption>): number => Math.max(0, ...captions.map(c => c.x + c.width))
const maxCaptionY = (captions: Array<Caption>): number => Math.max(0, ...captions.map(c => c.y + c.height))

export function stats(graph: Graph) {
  const nodes = values(graph.nodes)
  const captions = values(graph.captions)

  return {
    nodeCount: nodes.length,
    edgeCount: values(graph.edges).length,
    captionCount: captions.length,
    minNodeX: minNodeX(nodes),
    minNodeY: minNodeY(nodes),
    maxNodeX: maxNodeX(nodes),
    maxNodeY: maxNodeY(nodes),
    minCaptionX: minCaptionX(captions),
    minCaptionY: minCaptionY(captions),
    maxCaptionX: maxCaptionX(captions),
    maxCaptionY: maxCaptionY(captions)
  }
}

export const getNode = (graph: Graph, nodeId: string): Node => graph.nodes[nodeId]
export const getEdge = (graph: Graph, edgeId: string): Edge => graph.edges[edgeId]

export function edgesOf(graph: Graph, nodeId: string): Array<Edge> {
  return getNode(graph, nodeId).edgeIds.map(id => getEdge(graph, id))
}

export function nodesOf(graph: Graph, edgeId: string): Array<Node> {
  const { node1_id, node2_id } = getEdge(graph, edgeId)
  return [node1_id, node2_id].map(id => getNode(graph, id))
}


// ViewBox Calculations

// output: { minX, minY, w, h }
// These values are used to create the viewBox attribute for the outermost SVG,
// which is effectively the smallest rectangle that can be fit around all nodes.
export function calculateViewBox(graph: Graph): Viewbox {
  // const zoom = graph.zoom
  const graphStats = stats(graph)

  if (graphStats.nodeCount === 0) {
    return DEFAULT_VIEWBOX
  }

  const { 
    minNodeX, minNodeY, maxNodeX, maxNodeY,
    minCaptionX, minCaptionY, maxCaptionX, maxCaptionY
  } = graphStats

  const minX = Math.min(minNodeX, minCaptionX) - GRAPH_PADDING_X
  const minY = Math.min(minNodeY, minCaptionY) - GRAPH_PADDING_Y
  const maxX = Math.max(maxNodeX, maxCaptionX) + GRAPH_PADDING_X
  const maxY = Math.max(maxNodeY, maxCaptionY) + GRAPH_PADDING_Y
  const w = maxX - minX
  const h = maxY - minY

  return { minX, minY, w, h }
}

// Returns the geometric center point of a graph's viewbox
export function calculateCenter(graph: Graph): Point {
  const vb = calculateViewBox(graph)
  const x = vb.minX + (vb.w / 2)
  const y = vb.minY + (vb.h / 2)
  return { x, y }
}

// Tries to find position near a position on a graph not intersecting a node,
// starting at the center and incrementally expanding the search radius.
export function findFreePositionNear(graph: Graph, startPosition: Point): Point {
  const padding = 50
  const maxTries = 30
  let position, node, success = false, tries = 0, radius = 0

  do {
    position = positionNear(startPosition, radius)
    node = findIntersectingNode(Object.values(graph.nodes), position, padding)
    success = (node === undefined)
    tries += 1
    radius += 20
  } while (!success && tries < maxTries)

  return success ? position : startPosition
}

// Picks random position within a radius of another position
export function positionNear({ x, y }: Point, radius: number) {
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
export function newGraph(attributes: GraphAttributes = {}): Graph {
  return merge({}, DEFAULT_GRAPH, attributes)
}

export function addNode(graph: Graph, attributes: NodeAttributes, findPosition: boolean = false): Graph {
  let node = newNode(attributes)

  // Place the node at random spaced position near the graph center, 
  // unless coordinates are provided
  if (findPosition || !isNumber(node.x) || !isNumber(node.y)) {
    merge(node, findFreePositionNear(graph, calculateCenter(graph)))
  }

  graph.nodes[node.id] = node
    
  return graph
}

export function addNodes(graph: Graph, nodes: Array<Node>): Graph {
  nodes.forEach(node => addNode(graph, node))
  return graph
}

export function removeNode(graph: Graph, nodeId: string): Graph {
  edgesOf(graph, nodeId).forEach(edge => removeEdge(graph, edge.id))
  delete graph.nodes[nodeId]
  return graph
}

export function updateNode(graph: Graph, nodeId: string, attributes: NodeAttributes): Graph {
  merge(graph.nodes[nodeId], attributes)

  // If scale is changed, update any associated edges
  if (attributes.scale) {
    edgesOf(graph, nodeId).forEach(edge => {
      let attribute = 's' + determineNodeNumber(edge, nodeId).toString()
      updateEdge(graph, edge.id, { [attribute]: attributes.scale })
    })
  }

  return graph
}

export function addEdgeIdToNode(graph: Graph, nodeId: string, edgeId: string): Graph {
  updateNode(graph, nodeId, { edgeIds: getNode(graph, nodeId).edgeIds.concat([edgeId]) })
  return graph
}

export function registerEdgeWithNodes(graph: Graph, edgeId: string): Graph {
  let edge = getEdge(graph, edgeId)
  if (!edge) { console.log(graph, edgeId) }
  addEdgeIdToNode(graph, edge.node1_id, edgeId)
  addEdgeIdToNode(graph, edge.node2_id, edgeId)
  return graph
}

export function removeEdgeIdFromNode(graph: Graph, nodeId: string, edgeId: string): Graph {
  updateNode(graph, nodeId, { edgeIds: getNode(graph, nodeId).edgeIds.filter(id => id !== edgeId) })
  return graph
}

export function unregisterEdgeWithNodes(graph: Graph, edgeId: string): Graph {
  let { node1_id, node2_id } = getEdge(graph, edgeId)
  removeEdgeIdFromNode(graph, node1_id, edgeId)
  removeEdgeIdFromNode(graph, node2_id, edgeId)
  return graph
}

export function addEdge(graph: Graph, edge: Edge): Graph {
  if (edge.node1_id === edge.node2_id) {
    return graph
  }

  graph.edges[edge.id] = edge
  registerEdgeWithNodes(graph, edge.id)

  return graph
}

export function createEdgeIndex(edges: Array<Edge>): EdgeIndex {
  function addToEdgeIndex(index: EdgeIndex, edge: Edge): EdgeIndex {
    let [id1, id2] = [edge.node1_id, edge.node2_id].sort()
  
    // no circular edges
    if (id1 === id2) {
      return index
    }
  
    if (index[id1]) {
      index[id1][id2] = (index[id1][id2] || []).concat([edge])
    } else {
      index[id1] = { [id2]: [edge] }
    }
  
    return index
  }

  return edges.reduce((index, edge) => {
    return addToEdgeIndex(index, edge)
  }, {})
}

// creates multiple edges between the same nodes
// so that the edges are nicely spaced out
export function addSimilarEdges(graph: Graph, edges: Array<Edge>): Graph {
  const count = edges.length

  // single edge is added normally
  if (count === 1) {
    addEdgeIfNodes(graph, edges[0])
    return graph
  }

  // curve strength is default if there are only 2 edges
  // curve strength approaches twice default as number of edges increases 
  const maxCurveStrength = defaultCurveStrength * (3 - 2/count)
  const range = maxCurveStrength * 2
  const step = range / (count - 1)
  let strength = -maxCurveStrength
  
  edges.forEach(edge => {
    let node1 = getNode(graph, edge.node1_id)
    let node2 = getNode(graph, edge.node2_id)
    edge = newEdgeFromNodes(node1, node2, edge)
    let { cx, cy } = calculateGeometry(edge, strength)
    edge = merge(edge, { cx, cy })
    addEdge(graph, edge)
    strength += step
  })

  return graph
}

export function addEdgesIfNodes(graph: Graph, edges: Array<Edge>): Graph {
  const edgeIndex = createEdgeIndex(edges)

  Object.keys(edgeIndex).forEach(id1 => {    
    Object.keys(edgeIndex[id1]).forEach(id2 => {
      const node1 = getNode(graph, id1)
      const node2 = getNode(graph, id2)
    
      if (!node1 || !node2) {
        return
      }
    
      addSimilarEdges(graph, edgeIndex[id1][id2])
    })
  })

  return graph
}

export function addEdgeIfNodes(graph: Graph, edge: Edge): Graph {
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

export function removeEdge(graph: Graph, edgeId: string): Graph {
  unregisterEdgeWithNodes(graph, edgeId)
  delete graph.edges[edgeId]
  return graph
}

export function updateEdge(graph: Graph, edgeId: string, attributes: EdgeAttributes): Graph {
  merge(graph.edges[edgeId], attributes)
  return graph
}

export function addCaption(graph: Graph, caption: Caption): Graph {
  graph.captions[caption.id] = caption
  return graph
}

// Dragging

// Moves a node to new position,
export function moveNode(graph: Graph, nodeId: string, deltas: Point): Graph {
  const newPosition = translatePoint(getNode(graph, nodeId), deltas)
  merge(graph.nodes[nodeId], newPosition)
  return graph
}

// This updates an edge's curve when one of it's nodes has moved
export function dragNodeEdge(graph: Graph, edge: Edge, nodeId: string, coordinates: Point): Graph {
  updateEdge(graph, edge.id, edgeCoordinates(determineNodeNumber(edge, nodeId), coordinates))
  return graph
}

// dragNode() updates the connected edges (if any)
// It does not change the coordinates of the node that is dragging.
export function dragNodeEdges(graph: Graph, nodeId: string, deltas: Point): Graph {
  const node = getNode(graph, nodeId)
  const coordinates = translatePoint(node, deltas) // x,y of location of new node
  edgesOf(graph, nodeId).forEach(edge => dragNodeEdge(graph, edge, nodeId, coordinates))
  return graph
}

function connectedNodeIds(graph: Graph, nodeId: string): Array<string> {
  let nodeIds = edgesOf(graph, nodeId).map(edge => [edge.node1_id, edge.node2_id]).flat()
  return [...new Set(nodeIds)].filter(id => id != nodeId)
}

export function forceLayout(graph: Graph, steps:number = 1000): Graph {
  let layout = buildForceLayout(graph)
  let nodeCount = Object.keys(graph.nodes).length
  let edgeCount = Object.keys(graph.edges).length

  steps = Math.round(steps / ((nodeCount + edgeCount) / 50))

  for (var i = 0; i < steps; i++) {
    layout.tick(0.01)
  }

  layout.eachNode((node: { id: string }, point: { p: Point }) => {
    updateNode(graph, node.id, { 
      x: point.p.x * 50,
      y: point.p.y * 50 
    })
  })

  // remove curve control points so that they're recalculated
  Object.values(graph.edges).forEach(edge => {
    const { id, node1_id, node2_id } = edge
    const node1 = getNode(graph, node1_id)
    const node2 = getNode(graph, node2_id)
    updateEdge(graph, id, merge(
      edgeCoordinates(1, node1),
      edgeCoordinates(2, node2),
      { cx: undefined, cy: undefined }
    ))
  })

  return graph
}

function buildForceLayout(graph: Graph) {
  let gr = new Springy.Graph()

  let nodeIds = Object.keys(graph.nodes)
  let edges = values(graph.edges).map(e => [e.node1_id, e.node2_id])

  gr.addNodes(...nodeIds)
  gr.addEdges(...edges)

  let stiffness = 200.0
  let repulsion = 300.0
  let damping = 0.5
  let minEnergyThreshold = 0.1

  return new Springy.Layout.ForceDirected(gr, stiffness, repulsion, damping, minEnergyThreshold);
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
  "addEdgeIfNodes": addEdgeIfNodes,
  "addEdgesIfNodes": addEdgesIfNodes,
  "addSimilarEdges": addSimilarEdges,
  "removeEdge": removeEdge,
  "updateEdge": updateEdge,
  "addCaption": addCaption,
  "moveNode": moveNode,
  "dragNodeEdges": dragNodeEdges,
  "connectedNodeIds": connectedNodeIds,
  "forceLayout": forceLayout,
  "registerEdgeWithNodes": registerEdgeWithNodes
}
