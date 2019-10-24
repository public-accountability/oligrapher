import curry from 'lodash/curry'
import merge from 'lodash/merge'
import { generate as generateId } from 'shortid'
import { node as nodeDefaults } from '../../app/displayDefaults'
import { setAttributes } from './'

const nodeTypes = new Set(['circle', 'image', 'triangle'])

// const defaults = {
//   id: null,
//   display: {
//     name: null,
//     x: null,
//     y: null,
//     scale: 1,
//     status: "normal",
//     type: "circle",
//     image: null,
//     url: null
//   }
// }

// export function newNode(attributes = {}) {
//   let node = merge({}, defaults, attributes)

//   if (!node.id) {
//     node.id = generateId()
//   }

//   return node
// }

// export function circle(node) {
//   return { cx: node.display.x,
//            cy: node.display.y,
//            r: nodeDefaults.circle.radius * node.display.scale,
//            fill: nodeDefaults.circle.color }
// }

// export default {
//   "new": newNode,
//   "circle": cricle
// }






export default class Node {
  id = null
  display = {}
  display
  x = null
  y = null
  scale = 1
  type = 'circle'

  constructor(attributes) {
    // this.setAttributes = curry(setAttributes)(this)

    // this.setAttributes(attributes)

    // if (!this.id) {
    //   this.id = generateId()
    // }
  }

  move(delta) {
    this.x = this.x + delta.x
    this.y = this.y + delta.y
  }

  get [Symbol.toStringTag]() {
    return 'Node'
  }

  /* Static Methods */

  // return set of all possible nodes
  static get nodeTypes() {
    return nodeTypes
  }
}
