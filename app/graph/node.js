import merge from 'lodash/merge'
import { generate } from 'shortid'

// const nodeTypes = new Set(['circle', 'image', 'triangle'])

const displayDefaults = {
  circle: {
    radius: 25,
    color: "#ccc"
  }
}

const nodeDefaults = {
  id: null,
  display: {
    name: null,
    x: null,
    y: null,
    scale: 1,
    status: "normal",
    type: "circle",
    image: null,
    url: null
  }
}

export function newNode(attributes = {}) {
  let node = merge({}, nodeDefaults, attributes)

  if (!node.id) {
    node.id = generate()
  }

  return node
}

export function circle(node) {
  return { cx: node.display.x,
           cy: node.display.y,
           r: displayDefaults.circle.radius * node.display.scale,
           fill: displayDefaults.circle.color }
}

export default {
  "new": newNode,
  "circle": circle
}
