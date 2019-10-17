import produce from 'immer'

// {
//   type: 'SET_MODE'
//   mode: 'editor'
//   enabled: false
// }

export default produce((state, action) => {
  switch(action.type) {
  case 'SET_MODE':
    state.modes[action.mode] = action.enabled
    return
  }
}, {})
