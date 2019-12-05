import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { IconContext } from "react-icons"

import {
  FaRegCircle,
  FaBezierCurve,
  FaFlipboard,
  FaTv,
  FaRegEdit,
  FaRegTrashAlt
} from "react-icons/fa"

import { FiHelpCircle } from 'react-icons/fi'

import {
  GoTextSize,
  GoGear
} from 'react-icons/go'

import {
  TiArrowMove
} from 'react-icons/ti'


import EditorMenuItem from '../components/editor/EditorMenuItem'

const iconContextValue = {
  size: "35px",
  className: "editor-menu-icon",
  color: 'gray'
}

const MENU_ITEMS = [
  {
    icon: <FaRegCircle />,
    key: 'node'
  },
  {
    icon: <FaBezierCurve />,
    key: 'edge'
  },
  {
    icon: <GoTextSize />,
    key: 'text'
  },
  {
    icon: <FaFlipboard />,
    key: 'legend'
  },
  {
    icon: <FaTv />,
    key: 'story'
  },
  {
    icon: <FaRegEdit />,
    key: 'style'
  },
  {
    icon: <TiArrowMove />,
    key: 'organize'
  },
  {
    icon: <FaRegTrashAlt />,
    key: 'delete'
  },
  {
    icon: <GoGear />,
    key: 'settings'
  },
  {
    icon: <FiHelpCircle />,
    key: 'help'
  }
]


export function EditorMenu(props) {
  return <div className="editor-menu">
           <IconContext.Provider value={iconContextValue} >
             { MENU_ITEMS.map(menuItem => <EditorMenuItem key={menuItem.key} icon={menuItem.icon} />) }
           </IconContext.Provider>
         </div>
}


EditorMenu.propTypes = {}

const mapStateToProps = function(state) {
  return {}
}


export default connect(mapStateToProps)(EditorMenu)
