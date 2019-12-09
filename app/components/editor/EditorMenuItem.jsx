import React from 'react'
import PropTypes from 'prop-types'

import MENU from '../../editorMenu'

export default function EditorMenuItem(props) {
  const item = MENU[props.item]

  return <div className="editor-menu-item">
           <span>{item.icon}</span>
         </div>
}

EditorMenuItem.propTypes = {
  item: PropTypes.oneOf(Object.keys(MENU)).isRequired
}


// EditorMenuItem.propTypes = {
//   // action: () => {}
// }
