import React, { useCallback} from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { FaRegCircle } from "@react-icons/all-files/fa/FaRegCircle"
import { FaRegEdit } from "@react-icons/all-files/fa/FaRegEdit"
import { FaBezierCurve } from "@react-icons/all-files/fa/FaBezierCurve"
import { FiHelpCircle } from '@react-icons/all-files/fi/FiHelpCircle'
import { FiUsers } from '@react-icons/all-files/fi/FiUsers'
import { GoTextSize } from '@react-icons/all-files/go/GoTextSize'
import { GoGear } from '@react-icons/all-files/go/GoGear'
import { GiLinkedRings } from '@react-icons/all-files/gi/GiLinkedRings'
import { FaChartLine } from '@react-icons/all-files/fa/FaChartLine'
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
    icon: <FaChartLine />,
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
