import Curve from '../graph/curve'

export const X_OFFSET = {
  node: 150,
  connections: 150,
  edge: 130,
  caption: -180
}

export const Y_OFFSET = {
  node: -230,
  connections: -230,
  edge: -280,
  caption: -87
}

export const set = (display, type = null, id = null) => {
  display.floatingMenu.type = type
  display.floatingMenu.id = id
}

export const clear = display => {
  set(display, null, null)
}

export const getId = (display, type) => {
  return (!type || type === display.floatingMenu.type)
    ? display.floatingMenu.id
    : null
}

export const getType = display => display.floatingMenu.type

// converts position of svg element to equivalent html position
export const svgToHtmlPosition = (display, position) => {
  const { svgZoom, offset } = display

  return {
    x: Math.trunc((position.x + offset.x) * svgZoom),
    y: Math.trunc((position.y + offset.y) * svgZoom)
  }
}

export const floatingMenuPositionSelector = state => {
  const { id, type } = state.display.floatingMenu

  if (!id || !type) {
    return null
  }

  return transformPosition(
    state.display, 
    getPosition(state.graph, id, type),
    type
  )
}

// used to calculate floating menu position based on node or edge position
export const transformPosition = (display, position, type) => {
  const { svgZoom } = display
  const xOffset = X_OFFSET[type]
  const yOffset = Y_OFFSET[type]

  const { x, y } = svgToHtmlPosition(display, position)

  return {
    x: x + xOffset * svgZoom,
    y: y + yOffset * svgZoom
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
