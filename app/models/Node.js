import { generate as generateId } from 'shortid'
import { setAttributes } from './'

export const nodeTypes = new Set(['circle', 'image', 'triangle'])

export default class Node {
  id = null
  x = null
  y = null
  scale = 1
  type = 'circle'

  constructor(attributes) {
    setAttributes(this, attributes)

    if (!this.id) {
      this.id = generateId()
    }
  }
}
