import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import MENU from '../../editorMenu'

export default function EditorMenuItem(props) {
  const item = MENU[props.item]
  const dispatch = useDispatch()
  const onClick = () => dispatch({ type: 'TOGGLE_TOOL', tool: props.item })

  return (
    <div className="editor-menu-item" onClick={onClick}>
      <span>{item.icon}</span>
    </div>
  )
}

EditorMenuItem.propTypes = {
  item: PropTypes.oneOf(Object.keys(MENU)).isRequired
}