import produce from 'immer'

// Examples:

// {
//   type: 'SET_MODE'
//   mode: 'editor'
//   enabled: false
// }

// {
//   type: 'OPEN_EDIT_NODE_MENU'
//   id:   123
// }

function checkOpenTool(state, requiredTool) {
  if (state.editor.tool === requiredTool) {
    return true
  } else {
    console.error('Correct tool is not open.')
    return false
  }
}

export default produce((state, action) => {
  switch(action.type) {
  case 'SET_MODE':
    state.modes[action.mode] = action.enabled
    return
  case 'OPEN_TOOL':
    state.editor.tool = action.item

    if (action.item != 'node') {
      state.editor.editNode = null  // Reset the selected node
    }
    return
  case 'OPEN_EDIT_NODE_MENU':
    if (checkOpenTool(state, 'node')) {
      state.editor.editNode = action.id
    }
    return
  case 'OPEN_EDIT_EDGE_MENU':
    if (checkOpenTool(state, 'edge')) {
      state.editor.editEdge = action.id
    }
    return
  }
}, {})
