import React, {useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import defaultState from '../util/defaultState'

import EditMenu from '../components/editor/EditMenu'

const OPTIONS = Object.freeze(Object.keys(defaultState.attributes.settings))

function SettingsOption({ option }) {
  const dispatch = useDispatch()
  const value = useSelector(state => state.attributes.settings[option])

  const onChange = useCallback(
    () => dispatch({type: 'UPDATE_SETTING', key: option, value: !value}),
    [dispatch, value]
  )

  return <div className="settings-option">
           <span>{option}: </span>
           <span>
             <input type="checkbox" checked={value} onChange={onChange} />
           </span>
         </div>
}

SettingsOption.propTypes = {
  option: PropTypes.oneOf(OPTIONS).isRequired
}

export default function Settings() {
  return <EditMenu tool="settings">
           { OPTIONS.map( option => <SettingsOption key={option} option={option} />) }
         </EditMenu>
}
