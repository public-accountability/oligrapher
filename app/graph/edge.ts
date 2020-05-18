import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { generate } from 'shortid'

import { Node } from './node'
import { Point } from '../util/geometry'
import { stringOrBool } from '../util/types'

export interface EdgeAttributes {
  id?: string,
  node1_id?: string,
  node2_id?: string,
  scale?: number,
  arrow?: boolean,
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
  status: string,
  scale: number,
  arrow: boolean,
  dash: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  s1: number,
  s2: number
}

export interface EdgeDefaults extends EdgeAttributes {
  status: string,
  scale: number,
  arrow: boolean,
  dash: boolean
}

const edgeDefaults: EdgeDefaults = {
  status: "normal",
  scale: 1,
  arrow: false,
  dash: false
}

export function newEdge(attributes: EdgeAttributes = {}) {
  return merge({ id: generate(), label: "New Edge" }, edgeDefaults, attributes)
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