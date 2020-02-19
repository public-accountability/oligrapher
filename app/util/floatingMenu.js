export const set = (state, type = null, id = null) => {
  state.display.floatingMenu.type = type
  state.display.floatingMenu.id = id
}

export const clear = (state) => {
  set(state, null, null)
}

export const getId = (state, type) => {
  return (type === state.display.floatingMenu.type) ? 
    state.display.floatingMenu.id : 
    null
}

export default {
  clear,
  set,
  getId
}