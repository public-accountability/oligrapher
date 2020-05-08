import produce from 'immer'

export default produce((attributes, action) => {
  switch(action.type) {
  case 'UPDATE_ATTRIBUTE':
    attributes[action.name] = action.value
    return
  case 'UPDATE_SETTING':
    attributes.settings[action.key] = action.value
    return
  case 'SET_EDITORS':
    attributes.editors = action.editors
    return
  case 'SET_LOCK':
    attributes.lock = action.lock
    return
  case 'SAVE_SUCCESS':
    if (!attributes.id) {
      attributes.id = action.id
    }
    return
  default:
    return attributes
  }
}, null)