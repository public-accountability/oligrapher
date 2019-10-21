import curry from 'lodash/curry'
import { generate as generateId } from 'shortid'
import { setAttributes } from './'
import { node as nodeDefaults } from '../../app/displayDefaults'

const nodeTypes = new Set(['circle', 'image', 'triangle'])

export default class Node {
  id = null
  x = null
  y = null
  scale = 1
  type = 'circle'

  constructor(attributes) {
    this.setAttributes = curry(setAttributes)(this)

    this.setAttributes(attributes)

    if (!this.id) {
      this.id = generateId()
    }
  }


  get circle() {
    return {
      cx: this.x,
      cy: this.y,
      r: nodeDefaults.circle.radius * this.scale,
      fill: nodeDefaults.circle.color
    }
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
