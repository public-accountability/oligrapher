import React, { useCallback} from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { FaRegCircle, FaBezierCurve, FaRegEdit } from "react-icons/fa"
import { FiHelpCircle, FiUsers } from 'react-icons/fi'
import { GoTextSize, GoGear } from 'react-icons/go'
import { GiLinkedRings } from 'react-icons/gi'
import { AiOutlineFundProjectionScreen } from 'react-icons/ai'
import noop from 'lodash/noop'

const MENU = {
  "node": {
    icon: <FaRegCircle />,
    title: 'Add Node'
  },
  "text": {
    icon: <GoTextSize />,
    title: 'Add Text'
  },
  "style": {
    icon: <FaRegEdit />,
    title: 'Style Selected Nodes'
  },
  "interlocks": {
    icon: <GiLinkedRings />,
    title: 'Interlocks'
  },
  "organize": {
    icon: <FaBezierCurve />,
    title: 'Organize Map'
  },
  "annotations": {
    icon: <AiOutlineFundProjectionScreen />,
    title: 'Annotations'
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

export default function EditorMenuItem({ item, disabled }) {
  const { title, icon } = MENU[item]
  const dispatch = useDispatch()
  const toggleTool = useCallback(() => dispatch({ type: 'TOGGLE_TOOL', tool: item }), [dispatch, item])
  const toggleAnnotations = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])
  const onClick = item === 'annotations' ? toggleAnnotations : toggleTool
  const className = `editor-menu-item editor-${item}-item`
    + (disabled ? ' disabled' : '')

  return (
    <div className={className} onClick={disabled ? noop : onClick}>
      <span title={title}>{icon}</span>
    </div>
  )
}

EditorMenuItem.propTypes = {
  item: PropTypes.oneOf(Object.keys(MENU)).isRequired,
  disabled: PropTypes.bool
}

EditorMenuItem.defaultProps = {
  disabled: false
}