import isNumber from "lodash/isNumber"
import merge from "lodash/merge"
import assign from "lodash/assign"
import uniq from "lodash/uniq"
import { isLittleSisId } from "../util/helpers"

// import Springy from 'springy'
import { Point, translatePoint, rotatePoint } from "../util/geometry"
import { Node, NodeAttributes, newNode, findIntersectingNode } from "./node"
import {
  Edge,
  EdgeAttributes,
  edgeCoordinates,
  newEdgeFromNodes,
  determineNodeNumber,
} from "./edge"
import { Caption } from "./caption"
import { curveSimilarEdges } from "./curve"
import { LsEdge } from "../datasources/littlesis"
import { Annotation } from "../util/annotations"

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
  nodes: NodeMap
  edges: EdgeMap
  captions: CaptionMap
}

export interface GraphAttributes {
  nodes?: NodeMap
  edges?: EdgeMap
  captions?: CaptionMap
}

export interface EdgeIndex {
  [key: string]: { [key: string]: LsEdge[] }
}

export interface Viewbox {
  minX: number
  minY: number
  w: number
  h: number
}

// Overview
//   - Stats & Getters
//   - ViewBox Calculations
//   - Graph Functions
//   - Dragging
//   - Add Connections

// Stats, Getters, and Calculations
const minNodeX = (nodes: Array<Node>): number => Math.min(...nodes.map(n => n.x))
const minNodeY = (nodes: Array<Node>): number => Math.min(...nodes.map(n => n.y))
const maxNodeX = (nodes: Array<Node>): number => Math.max(...nodes.map(n => n.x))
const maxNodeY = (nodes: Array<Node>): number => Math.max(...nodes.map(n => n.y))

const edgeControlPointX = (edge: Edge): number => (edge.x1 + edge.x2) / 2 + (edge.cx || 0)
const edgeControlPointY = (edge: Edge): number => (edge.y1 + edge.y2) / 2 + (edge.cy || 0)

const minEdgeX = (edges: Array<Edge>): number => Math.min(...edges.map(edgeControlPointX))
const minEdgeY = (edges: Array<Edge>): number => Math.min(...edges.map(edgeControlPointY))
const maxEdgeX = (edges: Array<Edge>): number => Math.max(...edges.map(edgeControlPointX))
const maxEdgeY = (edges: Array<Edge>): number => Math.max(...edges.map(edgeControlPointY))

const minCaptionX = (captions: Array<Caption>): number => Math.min(...captions.map(c => c.x))
const minCaptionY = (captions: Array<Caption>): number => Math.min(...captions.map(c => c.y))
const maxCaptionX = (captions: Array<Caption>): number =>
  Math.max(...captions.map(c => c.x + c.width))
const maxCaptionY = (captions: Array<Caption>): number =>
  Math.max(...captions.map(c => c.y + c.height))

interface GraphStats {
  nodeCount: number
  edgeCount: number
  captionCount: number
  minNodeX: number
  minNodeY: number
  maxNodeX: number
  maxNodeY: number
  minEdgeX: number
  minEdgeY: number
  maxEdgeX: number
  maxEdgeY: number
  minCaptionX: number
  minCaptionY: number
  maxCaptionX: number
  maxCaptionY: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export const graphStats = (graph: Graph) => {
  return stats(
    Object.values(graph.nodes),
    Object.values(graph.edges),
    Object.values(graph.captions)
  )
}

export const stats = (nodes: Node[], edges: Edge[], captions: Caption[]): GraphStats => {
  const graphStats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    captionCount: captions.length,
    minNodeX: minNodeX(nodes),
    minNodeY: minNodeY(nodes),
    maxNodeX: maxNodeX(nodes),
    maxNodeY: maxNodeY(nodes),
    minEdgeX: minEdgeX(edges),
    minEdgeY: minEdgeY(edges),
    maxEdgeX: maxEdgeX(edges),
    maxEdgeY: maxEdgeY(edges),
    minCaptionX: minCaptionX(captions),
    minCaptionY: minCaptionY(captions),
    maxCaptionX: maxCaptionX(captions),
    maxCaptionY: maxCaptionY(captions),
  }

  graphStats.minX = Math.min(graphStats.minNodeX, graphStats.minEdgeX, graphStats.minCaptionX)
  graphStats.minY = Math.min(graphStats.minNodeY, graphStats.minEdgeY, graphStats.minCaptionY)
  graphStats.maxX = Math.max(graphStats.maxNodeX, graphStats.maxEdgeX, graphStats.maxCaptionX)
  graphStats.maxY = Math.max(graphStats.maxNodeY, graphStats.maxEdgeY, graphStats.maxCaptionY)
  return graphStats
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

type PaddingType = {
  left: number
  right: number
  top: number
  bottom: number
}

export const GRAPH_PADDING = 100

// const DEFAULT_PADDING: PaddingType = {
//   left: GRAPH_PADDING,
//   right: GRAPH_PADDING,
//   top: GRAPH_PADDING,
//   bottom: GRAPH_PADDING
// }

const handleInfinite = (value: number) => (isFinite(value) ? value : 0)

// Finds the smallest rectangle with padding that fits around all nodes.
export function calculateViewBox(
  nodes: Node[],
  edges: Edge[],
  captions: Caption[],
  padding: number = GRAPH_PADDING
): Viewbox {
  const graphStats = stats(nodes, edges, captions)
  let minX = handleInfinite(graphStats.minX) - padding
  let minY = handleInfinite(graphStats.minY) - padding
  let maxX = handleInfinite(graphStats.maxX) + padding
  let maxY = handleInfinite(graphStats.maxY) + padding
  const w = maxX - minX
  const h = maxY - minY
  return { minX, minY, w, h }

  // adjustments to enforce minimum 400x300 viewbox
  // const diffX = Math.max(400 - w, 0)
  // const diffY = Math.max(300 - h, 0)

  // return {
  //   minX: minX - diffX / 2,
  //   minY: minY - diffY / 2,
  //   w: w + diffX,
  //   h: h + diffY
  // }
}

export function calculateZoomFromViewbox(viewbox: Viewbox, height: number) {}

export function calculateViewBoxFromGraph(graph: Graph): Viewbox {
  return calculateViewBox(
    Object.values(graph.nodes),
    Object.values(graph.edges),
    Object.values(graph.captions)
  )
}

// recalculate view box based on elements that are highlighted
export function calculateAnnotationViewBox(graph: Graph, annotation: Annotation): Viewbox {
  const nodes = Object.values(graph.nodes).filter(node => annotation.nodeIds.includes(node.id))
  const edges = Object.values(graph.edges).filter(edge => annotation.edgeIds.includes(edge.id))
  const captions = Object.values(graph.captions).filter(caption =>
    annotation.captionIds.includes(caption.id)
  )
  const padding = 250
  return calculateViewBox(nodes, edges, captions, padding)
}

// Returns the geometric center point of a graph's viewbox
export function calculateCenter(graph: Graph): Point {
  const vb = calculateViewBoxFromGraph(graph)
  const x = vb.minX + vb.w / 2
  const y = vb.minY + vb.h / 2
  return { x, y }
}

// Tries to find position near a position on a graph not intersecting a node,
// starting at the center and incrementally expanding the search radius.
export function findFreePositionNear(graph: Graph, startPosition: Point): Point {
  const padding = 50
  const maxTries = 30
  const nodes = Object.values(graph.nodes)
  let position,
    node,
    success = false,
    tries = 0,
    radius = 0

  do {
    position = positionNear(startPosition, radius)
    node = findIntersectingNode(nodes, position, padding)
    success = node === undefined
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
export function newGraph(attributes: GraphAttributes | undefined): Graph {
  return Object.assign(
    {
      nodes: {},
      edges: {},
      captions: {},
    },
    attributes
  )
}

export function addNode(graph: Graph, attributes: NodeAttributes, position?: Point | false): Graph {
  let node = newNode(attributes)

  // skip if already contains node with same id
  if (Object.keys(graph.nodes).includes(node.id)) {
    return graph
  }

  // Place the node at random spaced position near a provided point
  // or the graph center, unless coordinates are provided
  if (position || !isNumber(node.x) || !isNumber(node.y)) {
    if (typeof position !== "object") {
      position = calculateCenter(graph)
    }

    merge(node, findFreePositionNear(graph, position))
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

export function removeNodes(graph: Graph, nodeIds: string[]): Graph {
  nodeIds.forEach(nodeId => removeNode(graph, nodeId))
  return graph
}

export function updateNode(graph: Graph, nodeId: string, attributes: NodeAttributes): Graph {
  // assign instead of merge so that edgeIds can be updated with fewer ids
  assign(graph.nodes[nodeId], attributes)

  // If scale is changed, update any associated edges
  if (attributes.scale) {
    edgesOf(graph, nodeId).forEach(edge => {
      let attribute = "s" + determineNodeNumber(edge, nodeId).toString()
      updateEdge(graph, edge.id, { [attribute]: attributes.scale })
    })
  }

  return graph
}

export function addEdgeIdToNode(graph: Graph, nodeId: string, edgeId: string): Graph {
  const node = getNode(graph, nodeId)
  const newEdgeIds = [...new Set(node.edgeIds.concat(edgeId))]
  updateNode(graph, nodeId, { edgeIds: newEdgeIds })
  return graph
}

export function updateEdgeFromNodes(graph: Graph, edgeId: string): Graph {
  let { node1_id, node2_id } = getEdge(graph, edgeId)
  let node1 = getNode(graph, node1_id)
  let node2 = getNode(graph, node2_id)

  updateEdge(graph, edgeId, {
    x1: node1.x,
    y1: node1.y,
    x2: node2.x,
    y2: node2.y,
    s1: node1.scale,
    s2: node2.scale,
  })

  return graph
}

export function registerEdgeWithNodes(graph: Graph, edgeId: string): Graph {
  let { node1_id, node2_id } = getEdge(graph, edgeId)

  addEdgeIdToNode(graph, node1_id, edgeId)
  addEdgeIdToNode(graph, node2_id, edgeId)

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
  if (graph.edges[edge.id]) {
    return graph
  }

  if (edge.node1_id === edge.node2_id) {
    return graph
  }

  graph.edges[edge.id] = edge
  registerEdgeWithNodes(graph, edge.id)

  return graph
}

function addToEdgeIndex(index: EdgeIndex, lsEdge: LsEdge): EdgeIndex {
  let [id1, id2] = [lsEdge.node1_id, lsEdge.node2_id].sort()

  // no circular edges
  if (id1 === id2) {
    return index
  }

  if (index[id1]) {
    index[id1][id2] = (index[id1][id2] || []).concat([lsEdge])
  } else {
    index[id1] = { [id2]: [lsEdge] }
  }

  return index
}

export function createEdgeIndex(lsEdges: LsEdge[]): EdgeIndex {
  return lsEdges.reduce((index, lsEdge) => {
    return addToEdgeIndex(index, lsEdge)
  }, {})
}

// creates multiple edges between the same nodes
// so that the edges are nicely spaced out
export function addSimilarEdges(graph: Graph, lsEdges: LsEdge[]): Graph {
  curveSimilarEdges(
    lsEdges.map(lsEdge => {
      let node1 = getNode(graph, lsEdge.node1_id)
      let node2 = getNode(graph, lsEdge.node2_id)
      return newEdgeFromNodes(node1, node2, lsEdge)
    })
  ).forEach(edge => {
    addEdgeIfNodes(graph, edge)
  })

  return graph
}

export function addEdgesIfNodes(graph: Graph, lsEdges: LsEdge[]): Graph {
  const edgeIndex = createEdgeIndex(lsEdges)

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
  assign(graph.edges[edgeId], attributes)
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
  assign(graph.nodes[nodeId], newPosition)
  return graph
}

// This updates an edge's curve when one of it's nodes has moved
export function dragNodeEdge(graph: Graph, edge: Edge, nodeId: string, coordinates: Point): Graph {
  updateEdge(graph, edge.id, edgeCoordinates(determineNodeNumber(edge, nodeId), coordinates))
  return graph
}

// dragNodeEdges() updates the connected edges (if any)
// It does not change the coordinates of the node that is dragging.
export function dragNodeEdges(graph: Graph, nodeId: string, deltas: Point): Graph {
  const node = getNode(graph, nodeId)
  const coordinates = translatePoint(node, deltas) // x,y of location of new node
  edgesOf(graph, nodeId).forEach(edge => dragNodeEdge(graph, edge, nodeId, coordinates))
  return graph
}

function connectedNodeIds(graph: Graph, nodeId: string): Array<string> {
  let nodeIds = edgesOf(graph, nodeId)
    .map(edge => [edge.node1_id, edge.node2_id])
    .flat()
  return uniq(nodeIds).filter(id => id != nodeId)
}

export function forceLayout(graph: Graph, steps: number = 1000): Graph {
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
      y: point.p.y * 50,
    })
  })

  // re-add edges so that curves are recalculated by group
  let edges = Object.values(graph.edges)
  graph.edges = {}

  // update node coordinates and remove curve control points
  // so that they're recalculated
  edges = edges.map(edge => {
    const { node1_id, node2_id } = edge
    const node1 = getNode(graph, node1_id)
    const node2 = getNode(graph, node2_id)
    return assign(edge, edgeCoordinates(1, node1), edgeCoordinates(2, node2), {
      cx: undefined,
      cy: undefined,
    })
  })

  addEdgesIfNodes(graph, edges)

  return graph
}

function buildForceLayout(graph: Graph) {
  throw new Error("Springy needs to be replaced")
  // let gr = new Springy.Graph()

  // let nodeIds = Object.keys(graph.nodes)
  // let edges = values(graph.edges).map(e => [e.node1_id, e.node2_id])

  // gr.addNodes(...nodeIds)
  // gr.addEdges(...edges)

  // let stiffness = 200.0
  // let repulsion = 300.0
  // let damping = 0.5
  // let minEnergyThreshold = 0.1

  // return new Springy.Layout.ForceDirected(gr, stiffness, repulsion, damping, minEnergyThreshold);
}

export function hasContents(graph: Graph): boolean {
  const nodeCount = Object.values(graph.nodes).length
  const edgeCount = Object.values(graph.edges).length
  const captionCount = Object.values(graph.captions).length

  return nodeCount + edgeCount + captionCount > 0
}

export function littleSisNodes(graph: Graph): Node[] {
  return Object.values(graph.nodes).filter(node => isLittleSisId(node.id))
}

export default {
  new: newGraph,
  stats,
  graphStats,
  edgesOf,
  nodesOf,
  getNode,
  getEdge,
  calculateViewBox,
  addNode,
  addNodes,
  removeNode,
  updateNode,
  addEdge,
  addEdgeIfNodes,
  addEdgesIfNodes,
  addSimilarEdges,
  removeEdge,
  updateEdge,
  addCaption,
  moveNode,
  dragNodeEdges,
  connectedNodeIds,
  forceLayout,
  registerEdgeWithNodes,
  littleSisNodes,
}
