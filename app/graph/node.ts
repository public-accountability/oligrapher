import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { generate } from 'shortid'

import { Point } from '../util/geometry'
import { translatePoint, distance } from '../util/geometry'

export const NODE_RADIUS = 25

export interface NodeAttributes {
  id?: string,
  name?: string,
  x?: number,
  y?: number,
  scale?: number,
  image?: string,
  url?: string,
  color?: string,
  edgeIds?: Array<string>
}

export interface Node extends NodeAttributes {
  id: string,
  name: string,
  x: number,
  y: number,
  scale: number,
  color: string,
  edgeIds: Array<string>
}

interface NodeDefaults extends NodeAttributes {
  x: number,
  y: number,
  scale: number,
  color: string,
  edgeIds: Array<string>
}

const nodeDefaults: NodeDefaults = {
  x: 0,
  y: 0,
  scale: 1,
  color: '#ccc',
  edgeIds: []
}

export const nodeShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  scale: PropTypes.number,
  image: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string
}

export const propTypes = {
  node: PropTypes.shape(nodeShape),
  arrayOfNodes: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
}

export function newNode(attributes: NodeAttributes = {}): Node {
  return merge({ id: generate(), name: "New Node" }, nodeDefaults, attributes)
}

export default {
  "new": newNode,
  "types": propTypes
}

function intersects(coordinates: Point, node: Node, padding: number = 20): boolean {
  const radius = (NODE_RADIUS * node.scale) + padding
  return distance(node, coordinates) <= radius
}

// Returns the intersecting node (including a hard-coded buffer radius)
// If there are no intersections, this returns undefined
export function findIntersectingNode(nodes: Array<Node>, coordinates: Point, padding: number, selfId?: string): Node | undefined {
  return nodes.filter(node => node.id !== selfId).find(node => intersects(coordinates, node, padding))
}

export function findIntersectingNodeFromDrag(nodes: Array<Node>, draggedNode: Node, deltas: Point): Node | undefined {
  return findIntersectingNode(
    nodes,
    translatePoint(draggedNode, deltas),
    20,
    draggedNode.id
  )
}