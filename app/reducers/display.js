import produce from 'immer'

// {
//   type: 'SET_MODE'
//   mode: 'editor'
//   enabled: false
// }

// {
//   type: 'OPEN_EDIT_NODE_MENU'
//   id:   123
// }


export default produce((state, action) => {
  switch(action.type) {
  case 'SET_MODE':
    state.modes[action.mode] = action.enabled
    return
  case 'OPEN_TOOL':
    state.editor.tool = action.item

    // Remove node that is currently being edited
    if (action.item != 'node') {
      state.editor.editNode = null
    }

    return
  case 'OPEN_EDIT_NODE_MENU':
    if (state.editor.tool === 'node') {
      state.editor.editNode = action.id
    } else {
      console.error('cannot open the node menu unless editing tool is set to node')
    }
    return
  }
}, {})
