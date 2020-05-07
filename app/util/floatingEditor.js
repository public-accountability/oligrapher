import Curve from '../graph/curve'

export const X_OFFSET = {
  node: 50,
  connections: 50,
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
  node: 355,
  connections: 355,
  edge: 415,
  caption: 165
}

export const set = (display, type = null, id = null) => {
  display.floatingEditor.type = type
  display.floatingEditor.id = id
}

export const clear = display => {
  set(display, null, null)
}

export const getId = (display, type) => {
  return (!type || type === display.floatingEditor.type)
    ? display.floatingEditor.id
    : null
}

export const getType = display => display.floatingEditor.type

// converts position of svg element to equivalent html position
export const svgToHtmlPosition = (display, position) => {
  const { zoom, svgZoom, offset, svgOffset } = display

  // to be honest i don't fully understand why svgOffset has to be divided by zoom
  return {
    x: Math.trunc((position.x + offset.x + svgOffset.x / zoom) * svgZoom),
    y: Math.trunc((position.y + offset.y + svgOffset.y / zoom) * svgZoom) - display.containerYOffset
  }
}

export const floatingEditorPositionSelector = state => {
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

export const keepWithinScreen = (display, position, type) => {
  let { x, y } = position
  const width = X_SIZE[type]
  const height = Y_SIZE[type]
  const { width: svgWidth, height: svgHeight } = display.svgSize 
  const headerHeight = window.innerHeight - svgHeight
  const top = headerHeight + svgHeight / 2 + y
  const bottom = top + height
  const horizontalPadding = (window.innerWidth - svgWidth) / 2
  const left = window.innerWidth / 2 + x
  const right = left + width
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
export const transformPosition = (display, position, type) => {
  const xOffset = X_OFFSET[type]
  const yOffset = Y_OFFSET[type]

  const { x, y } = svgToHtmlPosition(display, position)

  return {
    x: x + xOffset,
    y: y + yOffset
  }
}

export const getPosition = (graph, id, type) => {
  let x, y, xb

  if (type === 'node' || type === 'connections') {
    ({ x, y } = graph.nodes[id])
    return { x, y }
  }

  if (type === 'edge') {
    ({ xb, y } = Curve.calculateGeometry(graph.edges[id]))
    return { x: xb, y }
  }

  if (type === 'caption') {
    ({ x, y } = graph.captions[id])
    return { x, y }
  }
}

const EDITOR_TYPES = {
  node: ['node', 'connections'],
  edge: ['edge'],
  caption: ['caption']
}

export const toggleEditor = (display, type, id) => {
  let isOpen = EDITOR_TYPES[type].includes(getType(display))
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
