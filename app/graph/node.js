import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { generate } from 'shortid'
import omit from 'lodash/omit'
import values from 'lodash/values'

import nodeDisplaySetting from '../NodeDisplaySettings'
import { translatePoint, distance } from '../util/helpers'

const nodeDefaults = {
  id: null,
  name: null,
  x: null,
  y: null,
  scale: 1,
  status: "normal",
  type: "circle",
  image: null,
  url: null,
  color: '#ccc'
}

export const nodeShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  scale: PropTypes.number,
  status: PropTypes.string.isRequired,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string
}

export const propTypes = {
  node: PropTypes.shape(nodeShape),
  arrayOfNodes: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
}

export function newNode(attributes = {}) {
  let node = merge({}, nodeDefaults, attributes)

  if (!node.id) {
    node.id = generate()
  }

  return node
}

export default {
  "new": newNode,
  "types": propTypes
}

// {x,y}, {x,y} ---> Boolean
function intersects(coordinates, node, padding = 20) {
  const radius = (nodeDisplaySetting.circleRadius * node.scale) + padding
  return distance(node, coordinates) <= radius
}

// Returns the intersecting node (including a hard-coded buffer radius)
// If there are no intersections, this returns undefined
export function findIntersectingNode(nodes, coordinates, selfId = null, padding = 20) {
  return values(omit(nodes, selfId)).find(node => intersects(coordinates, node, padding))
}

export function findIntersectingNodeFromDrag(nodes, draggedNode, deltas) {
  return findIntersectingNode(
    nodes,
    translatePoint(draggedNode, deltas),
    draggedNode.id
  )
}