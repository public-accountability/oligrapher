import produce from 'immer'

const updateSettings = (settings, key, value) => {
  settings[key] = value

  if (key === 'defaultStoryMode' && value) {
    settings['defaultExploreMode'] = false
  }

  if (key === 'defaultExploreMode' && value) {
    settings['defaultStoryMode'] = false
  }

  if (key === 'storyModeOnly' && value) {
    settings['exploreModeOnly'] = false
  }

  if (key === 'exploreModeOnly' && value) {
    settings['storyModeOnly'] = false
  }
}

export default produce((attributes, action) => {
  switch(action.type) {
  case 'UPDATE_ATTRIBUTE':
    attributes[action.name] = action.value
    return
  case 'UPDATE_SETTING':
    updateSettings(attributes.settings, action.key, action.value)
    return
  case 'SET_EDITORS':
    attributes.editors = action.editors
    return
  case 'SET_LOCK':
    attributes.lock = action.lock
    return
  default:
    return attributes
  }
}, null)