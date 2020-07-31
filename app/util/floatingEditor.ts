import { State, DisplayState, FloatingEditorType } from './defaultState'
import { Point } from './geometry'
import { Graph } from '../graph/graph'
import { edgeToCurve } from '../graph/curve'

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

export const set = (display: DisplayState, type: FloatingEditorType | null = null, id: string | null = null): void => {
  display.floatingEditor.type = type
  display.floatingEditor.id = id
}

export const clear = (display: DisplayState): void => {
  set(display, null, null)
}

export const getId = (display: DisplayState, type?: FloatingEditorType): string | null => {
  return (!type || type === display.floatingEditor.type)
    ? display.floatingEditor.id
    : null
}

export const getType = (display: DisplayState): FloatingEditorType | null => display.floatingEditor.type

export const svgToHtmlPosition = (display: DisplayState, position: Point): Point => {
  const svg = document.getElementById('oligrapher-svg') as any

  // for tests to pass, since jsdom doesn't cover svg, 
  // we just return the provided position unchaged
  if (typeof svg.createSVGPoint !== 'function') {
    return position
  }

  const point = svg.createSVGPoint()
  point.x = position.x
  point.y = position.y

  // using pannable because it's the innermost svg transformation
  // and getScreenCTM() incorporates all ancestor transformations
  const pannable = document.getElementById('oligrapher-pannable') as any

  return point.matrixTransform(pannable.getScreenCTM())
}

export const floatingEditorPositionSelector = (state: State): Point | null => {
  const { id, type } = state.display.floatingEditor

  if (!id || !type) {
    return null
  }

  return keepWithinScreen(state.display, transformPosition(
    state.display, 
    getPosition(state.graph, id, type),
    type
  ), type)
}

export const keepWithinScreen = (display: DisplayState, position: Point, type: FloatingEditorType): Point => {
  let { x, y } = position

  const top = y
  const left = x
  const width = X_SIZE[type]
  const height = Y_SIZE[type]
  const bottom = top + height
  const right = left + width

  const { width: svgWidth, height: svgHeight } = display.svgSize
  const headerHeight = window.innerHeight - svgHeight
  const horizontalPadding = (window.innerWidth - svgWidth) / 2
  const BUFFER = 20

  if (top < headerHeight + BUFFER) {
    y += headerHeight + BUFFER - top
  }

  if (bottom > window.innerHeight - BUFFER) {
    y -= bottom - window.innerHeight + BUFFER
  }

  if (left < horizontalPadding + BUFFER) {
    x += (horizontalPadding + BUFFER - left)
  }

  if (right > window.innerWidth - horizontalPadding - BUFFER) {
    x -= right - window.innerWidth + horizontalPadding + BUFFER
  }
  
  return { x, y }
}

// used to calculate floating editor position based on node or edge position
export const transformPosition = (display: DisplayState, position: Point, type: FloatingEditorType): Point => {
  const xOffset = X_OFFSET[type]
  const yOffset = Y_OFFSET[type]

  const { x, y } = svgToHtmlPosition(display, position)

  return {
    x: x + xOffset,
    y: y + yOffset
  }
}

export const getPosition = (graph: Graph, id: string, type: FloatingEditorType): Point => {
  let x, y, xb

  if (type === 'node' || type === 'connections') {
    ({ x, y } = graph.nodes[id])
    return { x, y }
  }

  if (type === 'edge') {
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

export const toggleEditor = (display: DisplayState, type: 'node' | 'edge' | 'caption', id: string): void => {
  let isOpen = EDITOR_TYPES[type].includes(getType(display) as string)
  let isBeingEdited = getId(display) === id

  if (isOpen && isBeingEdited) {
    clear(display)
  } else {
    set(display, type, id)
  }
}

export default {
  clear,
  set,
  getId,
  getType,
  transformPosition,
  toggleEditor
}
