export const X_OFFSET = {
  node: 120,
  edge: 100
}

export const Y_OFFSET = {
  node: -200,
  edge: -250
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

// used to calculate floating menu position based on node or edge position
export const transformPosition = (state, position, type) => {
  const xOffset = X_OFFSET[type] || 0
  const yOffset = Y_OFFSET[type] || 0

  const zoom = state.display.actualZoom / state.display.zoom
  const offset = state.display.offset

  return {
    x: Math.trunc((position.x + offset.x) * zoom + xOffset),
    y: Math.trunc((position.y + offset.y) * zoom + yOffset)
  }
}

export default {
  clear,
  set,
  getId,
  getType,
  transformPosition
}
