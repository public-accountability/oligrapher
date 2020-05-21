import React, { useCallback} from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { FaRegCircle, FaBezierCurve, FaFlipboard, FaTv, FaRegEdit, FaRegTrashAlt } from "react-icons/fa"
import { FiHelpCircle, FiUsers } from 'react-icons/fi'
import { GoTextSize, GoGear } from 'react-icons/go'

const MENU = {
  "node": {
    icon: <FaRegCircle />,
    title: 'Add Node'
  },
  "text": {
    icon: <GoTextSize />,
    title: 'Add Text'
  },
  "organize": {
    icon: <FaBezierCurve />,
    title: 'Organize Map'
  },
  "settings": {
    icon: <GoGear />,
    title: 'Settings'
  },
  "editors": {
    icon: <FiUsers />,
    title: 'Editors'
  },
  "help": {
    icon: <FiHelpCircle />,
    title: 'Help'
  }
}

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