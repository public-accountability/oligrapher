import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { generate } from 'shortid'
import { curveString, calculateCurve } from '../util/curve'

const edgeDefaults = {
  id: null,
  node1_id: null,
  node2_id: null,
  display: {
    label: null,
    cx: null,
    cy: null,
    scale: 1,
    arrow: null,
    dash: null,
    status: "normal",
    url: null
  }
}

// Edge ---> {x, y} || null
function controlPoint(edge) {
  if (edge.display.cx && edge.display.cy) {
    return { x: edge.display.cx, y: edge.display.cy }
  } else {
    return null
  }
}

export function newEdge(attributes = {}) {
  let edge = merge({}, edgeDefaults, attributes)

  if (!edge.id) {
    edge.id = generate()
  }

  return edge
}

export function edgeProps(nodes, edge) {
  let key = edge.id
  let node1 = nodes[edge.node1_id]
  let node2 = nodes[edge.node2_id]
  let curve = calculateCurve(node1, node2, controlPoint(edge))
  return { key, edge, node1, node2, curve }
}

export default {
  "new": newEdge,
  "edgeProps": edgeProps
}
