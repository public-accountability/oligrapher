const transformPosition = (position = null, type = null) => {
  if (!position || !type) {
    return null
  }

  if (type == 'node') {
    // a temporary and ad-hoc transormation used to roughly place the Edit Node 
    // menu to the right of the node being edited
    return {
      x: position.x + 150,
      y: position.y
    }
  } else {
    return position
  }
}

export const set = (state, type = null, id = null, position = null) => {
  state.display.floatingMenu.type = type
  state.display.floatingMenu.id = id
  state.display.floatingMenu.position = transformPosition(position, type)
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

export default {
  clear,
  set,
  getId,
  getType
}
