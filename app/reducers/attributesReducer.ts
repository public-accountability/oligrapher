import produce from 'immer'

import { AttributesState, UserSettings } from '../util/defaultState'

export function updateSetting(attributes: AttributesState, key: keyof UserSettings, value: boolean): void {
  attributes.settings[key] = value

  // defaultStoryMode and defaultExploreMode are mutually exclusive
  if (key === 'defaultStoryMode') {
    attributes.settings['defaultExploreMode'] = !value

    if (value === true) {
      attributes.settings['exploreModeOnly'] = false
    } else {
      attributes.settings['storyModeOnly'] = false
    }
  } else if (key === 'defaultExploreMode') {
    attributes.settings['defaultStoryMode'] = !value

    if (value === true) {
      attributes.settings['storyModeOnly'] = false
    } else {
      attributes.settings['exploreModeOnly'] = false
    }
  }

  if (key === 'storyModeOnly' && value === true) {
    attributes.settings['defaultStoryMode'] = true
    attributes.settings['exploreModeOnly'] = false
    attributes.settings['defaultExploreMode'] = false
  } else if (key === 'exploreModeOnly' && value === true) {
    attributes.settings['defaultExploreMode'] = true
    attributes.settings['storyModeOnly'] = false
    attributes.settings['defaultStoryMode'] = false
  }
}

export default produce((attributes: AttributesState, action: any): void => {
  switch(action.type) {
  case 'UPDATE_ATTRIBUTE':
    (attributes as any)[action.name] = action.value
    return
  case 'UPDATE_SETTING':
    updateSetting(attributes, action.key, action.value)
    return
  case 'ADD_EDITOR_SUCCESS':
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