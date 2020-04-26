import Curve from '../graph/curve'

export const X_OFFSET = {
  node: 120,
  edge: 100,
  caption: -150
}

export const Y_OFFSET = {
  node: -200,
  edge: -250,
  caption: -100
}

export const set = (state, type = null, id = null, position = null) => {
  state.display.floatingMenu.type = type
  state.display.floatingMenu.id = id
  state.display.floatingMenu.position = position
}

export const clear = (state) => {
  set(state)
}

export const getId = (state, type) => {
  return (!type || type === state.display.floatingMenu.type)
    ? state.display.floatingMenu.id
    : null
}

export const getType = (state) => {
  return state.display.floatingMenu.type
}

// converts position of svg element to equivalent html position
export const svgToHtmlPosition = (state, position) => {
  const { svgZoom, offset } = state.display

  return {
    x: Math.trunc((position.x + offset.x) * svgZoom),
    y: Math.trunc((position.y + offset.y) * svgZoom)
  }
}

// used to calculate floating menu position based on node or edge position
export const transformPosition = (state, position, type) => {
  const xOffset = X_OFFSET[type] || 0
  const yOffset = Y_OFFSET[type] || 0

  const { x, y } = svgToHtmlPosition(state, position)

  return {
    x: x + xOffset,
    y: y + yOffset
  }
}

const EDITOR_TYPES = {
  node: ['node', 'connections'],
  edge: ['edge'],
  caption: ['caption']
}

export const getPosition = (draft, id, type) => {
  let x, y, xb

  if (type === 'node') {
    ({ x, y } = draft.graph.nodes[id])
    return { x, y }
  }

  if (type === 'edge') {
    ({ xb, y } = Curve.calculateGeometry(draft.graph.edges[id]))
    return { x: xb, y }
  }

  if (type === 'caption') {
    ({ x, y } = draft.graph.captions[id])
    return { x, y }
  }
}

export const toggleEditor = (draft, id, type) => {
  let isOpen = EDITOR_TYPES[type].includes(getType(draft))
  let isBeingEdited = getId(draft) === id

  if (isOpen && isBeingEdited) {
    clear(draft)
  } else {
    let position = getPosition(draft, id, type)
    set(draft, type, id, transformPosition(draft, position, type))
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
