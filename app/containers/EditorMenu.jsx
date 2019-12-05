import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { IconContext } from "react-icons"
import { FaRegCircle, FaBezierCurve } from "react-icons/fa"

import EditorMenuItem from '../components/editor/EditorMenuItem'


const iconContextValue = {
  size: "30px",
  className: "editor-menu-icon"
}

const MENU_ITEMS = [
  {
    icon: <FaRegCircle />,
    key: 'addNode'
  },
  {
    icon: <FaBezierCurve />,
    key: 'customizeEdge'
  },
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
