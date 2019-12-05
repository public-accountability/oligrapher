import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditorMenuItem from '../components/editor/EditorMenuItem'

const MENU_ITEMS = [
  'N',
  'E'
]

export function EditorMenu(props) {
  return <div className="editor-menu">
           {
             MENU_ITEMS.map(icon => <EditorMenuItem key={icon} icon={icon} />)
           }
         </div>
}

EditorMenu.propTypes = {}

const mapStateToProps = function(state) {
  return {}
}


export default connect(mapStateToProps)(EditorMenu)
