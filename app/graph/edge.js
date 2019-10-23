import merge from 'lodash/merge'
import { generate } from 'shortid'
import { curveString } from '../util/curve'

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

export function newEdge(attributes = {}) {
  let edge = merge({}, edgeDefaults, attributes)

  if (!edge.id) {
    edge.id = generate()
  }

  return edge
}

export function curve(nodes, edge) {
  let node1 = nodes[edge.node1_id]
  let node2 = nodes[edge.node2_id]
  let control = { x: edge.display.cx, y: edge.display.cy }
  return curveString(node1, node2, control)
}


export function edgeProps(graph, edge) {
  return {
    key: edge.id,
    edge: edge,
    curve: curve(graph.nodes, edge),
    node1: graph.nodes[edge.node1_id],
    node2: graph.nodes[edge.node2_id]
  }
}

export default {
  "new": newEdge,
  "curve": curve
}
