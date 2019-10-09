import { generate as generateId } from 'shortid'
import { setAttributes } from './'

const SOURCES = ['custom', 'littlesis']

export default class Node {
  id = null
  x = null
  y = null
  scale = 1
  source = null

  constructor(attributes) {
    setAttributes(this, attributes)

    if (!this.id) {
      this.id = generateId()
    }
  }
}
