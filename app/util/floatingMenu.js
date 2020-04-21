export const NODE_X_OFFSET = 100
export const EDGE_X_OFFSET = 100

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

// used to calculate floating menu position based on node or edge position
export const transformPosition = (state, position, type) => {
  let xOffset

  if (type === 'node') {
    xOffset = NODE_X_OFFSET
  } else if (type === 'edge') {
    xOffset = EDGE_X_OFFSET
  } else {
    xOffset = 0
  }

  let zoom = state.display.actualZoom / state.display.zoom
  let offset = state.display.offset

  return {
    x: Math.trunc((position.x + offset.x) * zoom + xOffset),
    y: Math.trunc((position.y + offset.y) * zoom)
  }
}

export default {
  clear,
  set,
  getId,
  getType,
  transformPosition
}
