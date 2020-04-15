export const NODE_X_OFFSET = 100

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

// used to calculate floating menu position based on node's position
export const transformNodePosition = (state, position) => {
  let zoom = state.display.actualZoom / state.display.zoom
  let offset = state.display.offset

  return {
    x: Math.trunc((position.x + offset.x) * zoom + NODE_X_OFFSET),
    y: Math.trunc((position.y + offset.y) * zoom)
  }
}

export default {
  clear,
  set,
  getId,
  getType,
  transformNodePosition
}
