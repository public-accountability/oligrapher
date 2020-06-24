import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import Toolbox from './Toolbox'

const OPTIONS = {
  'Privacy': {
    "private": "Set map to private",
    "clone": "Allow map cloning",
    "list_sources": "Show source links"
  },
  'View': {
    "defaultStoryMode": "Default: Story Mode",
    "defaultExploreMode": "Default: Explore Mode",
    "storyModeOnly": "Story Mode Only",
    "exploreModeOnly": "Explore Mode Only"
  },
  'Editing': {
    "automaticallyAddEdges": "Automatically add edges",
    "scrollToZoom": "Scroll to zoom"
  }
}

export default function Settings() {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.attributes.settings)

  const onChange = useCallback(event => {
    const { name, checked } = event.target
    dispatch({ type: 'UPDATE_SETTING', key: name, value: checked })
  }, [dispatch])

  return (
    <Toolbox title="Settings">
      <div className="oligrapher-settings">
        { Object.keys(OPTIONS).map(label => (
          <div key={label}>
            <label>{label}</label>
            { Object.keys(OPTIONS[label]).map(key => (
              <div className="settings-option" key={key}>
                <div className="settings-option-name">{OPTIONS[label][key]}: </div>
                <div>
                  <input type="checkbox" name={key} checked={settings[key]} onChange={onChange} />
                </div>
              </div>
            )) }
          </div>
        )) }
      </div>
    </Toolbox>
  )
}
