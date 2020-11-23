import React, { useCallback} from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { FaRegCircle, FaBezierCurve, FaRegEdit } from "react-icons/fa"
import { FiHelpCircle, FiUsers } from 'react-icons/fi'
import { GoTextSize, GoGear } from 'react-icons/go'
import { GiLinkedRings } from 'react-icons/gi'
import FundProjectionScreenOutlined from '@ant-design/icons/FundProjectionScreenOutlined'
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
    icon: <FundProjectionScreenOutlined />,
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

export default function EditorMenuItem({ item, disabled, inUse }) {
  const { title, icon } = MENU[item]
  const dispatch = useDispatch()
  const toggleTool = useCallback(() => dispatch({ type: 'TOGGLE_TOOL', tool: item }), [dispatch, item])
  const toggleAnnotations = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])
  const helpUrl = useSelector(state => state.attributes.helpUrl)

  let onClick = toggleTool

  if (item === 'annotations') {
    onClick = toggleAnnotations
  } else if (item == 'help') {
    onClick = () =>  window.open(helpUrl, '_blank')
  }

  const className = `editor-menu-item editor-${item}-item`
    + (disabled ? ' editor-menu-item-disabled' : '')
    + (inUse ? ' editor-menu-item-in-use' : '')

  return (
    <div className={className} onClick={disabled ? noop : onClick}>
      <span title={title}>{icon}</span>
    </div>
  )
}

EditorMenuItem.propTypes = {
  item: PropTypes.oneOf(Object.keys(MENU)).isRequired,
  disabled: PropTypes.bool,
  inUse: PropTypes.bool.isRequired
}

EditorMenuItem.defaultProps = {
  disabled: false
}
