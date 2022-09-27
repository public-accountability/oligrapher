import { State, DisplayState, FloatingEditorTypeType } from './defaultState'
import { Point } from './geometry'
import { Graph } from '../graph/graph'
import { edgeToCurve } from '../graph/curve'
import { getElementById, getElementForGraphItem } from '../util/helpers'

export const X_OFFSET = {
  node: 40,
  connections: 40,
  edge: 30,
  caption: -250
}

export const Y_OFFSET = {
  node: -100,
  connections: -100,
  edge: -150,
  caption: -5
}

const X_SIZE = {
  node: 235,
  connections: 235,
  edge: 325,
  caption: 230
}

const Y_SIZE = {
  node: 415,
  connections: 415,
  edge: 420,
  caption: 175
}

export const set = (display: DisplayState, t: FloatingEditorTypeType | null = null, id: string | null = null): void => {
  display.floatingEditor.type = t
  display.floatingEditor.id = id
}

export const clear = (display: DisplayState): void => {
  set(display, null, null)
}

export const getId = (display: DisplayState, t?: FloatingEditorTypeType): string | null => {
  return (!t || t === display.floatingEditor.type) ? display.floatingEditor.id : null
}

export const getType = (display: DisplayState): FloatingEditorTypeType | null => display.floatingEditor.type

// Retrives position of Node, Edge, or Caption
export const getPosition = (graph: Graph, id: string, feType: FloatingEditorTypeType): Point => {
  let x, y, xb

  if (feType === 'node' || feType === 'connections') {
    ({ x, y } = graph.nodes[id])
    return { x, y }
  }

  if (feType === 'edge') {
    ({ xb, y } = edgeToCurve(graph.edges[id]))
    return { x: xb, y }
  }

  ({ x, y } = graph.captions[id])
  return { x, y }
}

const EDITOR_TYPES = {
  node: ['node', 'connections'],
  edge: ['edge'],
  caption: ['caption']
}

export const toggleEditor = (display: DisplayState, t: 'node' | 'edge' | 'caption', id: string): void => {
  let isOpen = Boolean(getType(display)) && EDITOR_TYPES[t].includes(getType(display) as string)
  let isBeingEdited = getId(display) === id

  if (isOpen && isBeingEdited) {
    clear(display)
  } else {
    set(display, t, id)
  }
}

export const floatingEditorPositionSelector = (state: State): Point | null => {
  const floatingEditor = state.display.floatingEditor

  if (!(floatingEditor.id && floatingEditor.type)) {
    return null
  }

  const svgRect = getElementById("oligrapher-svg").getBoundingClientRect()
  const itemRect = getElementForGraphItem(state.graph, floatingEditor.id, floatingEditor.type).getBoundingClientRect()

  const buffer = 20
  const width = X_SIZE[floatingEditor.type]
  const height = Y_SIZE[floatingEditor.type]

  let point = {
    x: itemRect.right + buffer,
    y: itemRect.bottom - (itemRect.height / 2)
  }

  // move to left side when it doesn't fit on the right
  if ((point.x + buffer + width) > svgRect.right) {
    point.x = itemRect.left - buffer - width
  }

  // move up if it would go off screen
  if ((point.y + height + buffer) > svgRect.bottom) {
    point.y -= ((point.y + height + buffer) - svgRect.bottom)
  }

  return point
}

export default {
  clear,
  set,
  getId,
  getType,
  toggleEditor
}
