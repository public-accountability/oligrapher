import produce from 'immer'

import { AttributesState, UserSettings } from '../util/defaultState'

export default produce((attributes: AttributesState, action: any): void => {
  switch(action.type) {
  case 'UPDATE_ATTRIBUTE':
    (attributes as any)[action.name] = action.value
    return
  case 'UPDATE_SETTING':
    attributes.settings[action.key as keyof UserSettings] = action.value
    return
  case 'ADD_EDITOR_SUCCESS':
    attributes.editors = action.editors
    return
  case 'REMOVE_EDITOR_SUCCESS':
    attributes.editors = action.editors
    return  
  case 'SET_LOCK':
    attributes.lock = {
      locked: action.lock.locked,
      userHasLock: action.lock.user_has_lock,
      name: action.lock.name
    }
    return
  case 'SAVE_SUCCESS':
    if (!attributes.id) {
      attributes.id = action.id
    }
    return
  default:
    return
  }
}, null)