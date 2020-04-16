import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import defaultState from '../util/defaultState'

const OPTION_DESCRIPTION = {
  "private": "Set map to private",
  "clone": "Allow map cloning",
  "defaultStoryMode": "Default: Story Mode",
  "defaultExploreMode": "Default: Explore Mode",
  "storyModeOnly": "Story Mode Only",
  "exploreModeOnly": "Explore Mode Only",
  "automaticallyAddEdges": "Automatically Add Edges"
}

function SettingsOption({ option }) {
  const dispatch = useDispatch()
  const value = useSelector(state => state.attributes.settings[option])

  const onChange = useCallback(
    () => dispatch({type: 'UPDATE_SETTING', key: option, value: !value}),
    [dispatch, option, value]
  )

  return (
    <div className="settings-option">
      <div>{OPTION_DESCRIPTION[option]}: </div>
      <div>
        <input type="checkbox" checked={value} onChange={onChange} />
      </div>
    </div>
  )
}

SettingsOption.propTypes = {
  option: PropTypes.oneOf(Object.keys(defaultState.attributes.settings)).isRequired
}

export default function Settings() {
  return (
    <div>
      <label>Privacy</label>
      <SettingsOption option="private" />
      <SettingsOption option="clone" />
      <hr />
      <label>View</label>
      <SettingsOption option="defaultStoryMode" />
      <SettingsOption option="defaultExploreMode" />
      <SettingsOption option="storyModeOnly" />
      <SettingsOption option="exploreModeOnly" />
      <hr />
      <label>Editing</label>
      <SettingsOption option="automaticallyAddEdge" />
    </div>
  )
}
