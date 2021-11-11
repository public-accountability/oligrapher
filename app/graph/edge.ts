import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { nanoid } from 'nanoid/non-secure'

import { Node } from './node'
import { ArrowType } from './arrow'
import { Point } from '../util/geometry'
import { stringOrBool } from '../util/types'

export type EdgeStatusType = "normal" | "highlighted" | "faded" | "selected"

export interface EdgeGeometry {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  s1: number,
  s2: number
  cx?: number,
  cy?: number,
}

export interface EdgeAttributes {
  id?: string,
  node1_id?: string,
  node2_id?: string,
  scale?: number,
  arrow?: ArrowType,
  dash?: boolean,
  label?: string,
  url?: string,
  x1?: number,
  y1?: number,
  x2?: number,
  y2?: number,
  cx?: number,
  cy?: number,
  s1?: number, // scale of node 1
  s2?: number // scale of node 2
}

export interface Edge extends EdgeAttributes {
  id: string,
  node1_id: string,
  node2_id: string,
  label: string,
  scale: number,
  arrow: ArrowType,
  dash: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  s1: number,
  s2: number
}

export interface EdgeDefaults extends EdgeAttributes {
  scale: number,
  arrow: ArrowType,
  dash: boolean
}

const edgeDefaults: EdgeDefaults = {
  scale: 1,
  arrow: null,
  dash: false
}

export function newEdge(attributes: EdgeAttributes = {}) {
  return merge({ id: nanoid(10), label: "New Edge" }, edgeDefaults, attributes)
}

export function newEdgeFromNodes(n1: Node, n2: Node, attributes: EdgeAttributes = {}): Edge {
  let edge = newEdge(attributes)
  edge.node1_id = n1.id
  edge.node2_id = n2.id
  edge.x1 = n1.x
  edge.y1 = n1.y
  edge.s1 = n1.scale
  edge.x2 = n2.x
  edge.y2 = n2.y
  edge.s2 = n2.scale

  return edge as Edge
}

export function edgeCoordinates(nodeNumber: number, coordinates: Point) {
  if (nodeNumber === 1) {
    return { x1: coordinates.x, y1: coordinates.y }
  } else if (nodeNumber === 2) {
    return { x2: coordinates.x, y2: coordinates.y }
  } else {
    throw new Error("Node number must be 1 or 2")
  }
}

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

export const edgeShape = {
  id: PropTypes.string.isRequired,
  node1_id: PropTypes.string.isRequired,
  node2_id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  arrow: stringOrBool.isRequired,
  dash: stringOrBool.isRequired,
  url: PropTypes.string,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  s1: PropTypes.number,
  s2: PropTypes.number
}

const types = {
  edge: PropTypes.shape(edgeShape),
  arrayOfEdges: PropTypes.arrayOf(PropTypes.shape(edgeShape))
}

export default {
  "new": newEdge,
  "newEdgeFromNodes": newEdgeFromNodes,
  "types": types
}
