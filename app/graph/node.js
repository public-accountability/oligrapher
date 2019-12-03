import merge from 'lodash/merge'
import { generate } from 'shortid'

const nodeDefaults = {
  id: null,
  name: null,
  x: null,
  y: null,
  scale: 1,
  status: "normal",
  type: "circle",
  image: null,
  url: null
}

export function newNode(attributes = {}) {
  let node = merge({}, nodeDefaults, attributes)

  if (!node.id) {
    node.id = generate()
  }

  return node
}

export default {
  "new": newNode
}
