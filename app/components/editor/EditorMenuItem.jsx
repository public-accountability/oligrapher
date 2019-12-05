import React from 'react'
import PropTypes from 'prop-types'

export default function EditorMenuItem(props) {
  return <div className="editor-menu-item">
           <span>{props.icon}</span>
         </div>
}


EditorMenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
}


EditorMenuItem.propTypes = {
  action: () => {}
}
