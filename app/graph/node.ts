import { nanoid } from "nanoid/non-secure"
import { Point, translatePoint, distance } from "../util/geometry"

export const NODE_RADIUS = 25

export interface NodeAttributes {
  id?: string
  name?: string
  description?: string
  x?: number
  y?: number
  scale?: number
  image?: string
  url?: string
  color?: string
  edgeIds?: Array<string>
}

export interface Node extends NodeAttributes {
  id: string
  name: string
  description?: string
  x: number
  y: number
  scale: number
  color: string
  edgeIds: Array<string>
}

export type NodeArray = Array<Node>

const nodeDefaults: NodeAttributes = {
  name: "New Node",
  x: 0,
  y: 0,
  scale: 1,
  color: "#ccc",
  edgeIds: [],
}

export function newNode(attributes: NodeAttributes = {}) {
  let node = Object.assign({}, nodeDefaults, attributes) as Node
  if (!node.id) {
    node.id = nanoid(10)
  }
  return node
}

function intersects(coordinates: Point, node: Node, padding: number = 20): boolean {
  const radius = NODE_RADIUS * node.scale + padding
  return distance(node, coordinates) <= radius
}

// Returns the intersecting node (including a hard-coded buffer radius)
// If there are no intersections, this returns undefined
export function findIntersectingNode(
  nodes: Array<Node>,
  coordinates: Point,
  padding: number,
  selfId?: string
): Node | undefined {
  return nodes
    .filter(node => node.id !== selfId)
    .find(node => intersects(coordinates, node, padding))
}

export function findIntersectingNodeFromDrag(
  nodes: Array<Node>,
  draggedNode: Node,
  deltas: Point
): Node | undefined {
  return findIntersectingNode(nodes, translatePoint(draggedNode, deltas), 20, draggedNode.id)
}

export default {
  new: newNode,
}
