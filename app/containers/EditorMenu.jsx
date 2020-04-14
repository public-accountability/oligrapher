import React from 'react'
import { connect } from 'react-redux'
import { IconContext } from "react-icons/lib"

import { MENU_ITEMS } from '../editorMenu'
import EditorMenuItem from '../components/editor/EditorMenuItem'

const iconContextValue = {
  size: "35px",
  className: "editor-menu-icon",
  color: 'gray'
}

export function EditorMenu() {
  return (
    <div className="editor-menu">
      <IconContext.Provider value={iconContextValue} >
        { MENU_ITEMS.map(item => <EditorMenuItem key={item} item={item} />) }
      </IconContext.Provider>
    </div>
  )
}

export default connect()(EditorMenu)
