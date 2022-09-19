import { AttributesState, UserSettings } from "./defaultState"

export default function updateSetting(attributes: AttributesState, key: keyof UserSettings, value: boolean): void {
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
