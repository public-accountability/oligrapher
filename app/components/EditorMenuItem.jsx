import React, { useCallback} from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import MENU from '../editorMenu'

export default function EditorMenuItem({ item }) {
  const { title, icon } = MENU[item]
  const dispatch = useDispatch()
  const onClick = useCallback(() => dispatch({ type: 'TOGGLE_TOOL', tool: item }), [dispatch, item])

  return (
    <div className={`editor-menu-item editor-${item}-item`} onClick={onClick}>
      <span title={title}>{icon}</span>
    </div>
  )
}

EditorMenuItem.propTypes = {
  item: PropTypes.oneOf(Object.keys(MENU)).isRequired,
  onClick: PropTypes.func
}