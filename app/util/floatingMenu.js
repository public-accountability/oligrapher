export const NODE_X_OFFSET = 200

export const set = (state, type = null, id = null, position = null) => {
  state.display.floatingMenu.type = type
  state.display.floatingMenu.id = id
  state.display.floatingMenu.position = position
}

export const clear = (state) => {
  set(state)
}

export const getId = (state, type) => {
  return (type == state.display.floatingMenu.type) ?
    state.display.floatingMenu.id :
    null
}

export const getType = (state) => {
  return state.display.floatingMenu.type
}

// used to calculate floating menu position based on node's position
export const transformNodePosition = (position, zoom) => {
  return {
    x: Math.trunc((position.x + NODE_X_OFFSET) * zoom),
    y: Math.trunc(position.y * zoom)
  }
}

export default {
  clear,
  set,
  getId,
  getType,
  transformNodePosition
}
