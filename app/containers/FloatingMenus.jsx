import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'
import EditCaptionMenu from './EditCaptionMenu'
import Settings from './Settings'

export function FloatingMenus({visible}) {
  return <>
           <div style={{width: 0, overflow: "hidden"}} id="caption-text-input"></div>
           { visible.editNodeMenu && <EditNodeMenu /> }
           { visible.editEdgeMenu && <EditEdgeMenu /> }
           { visible.editCaptionMenu && <EditCaptionMenu /> }
           { visible.settingsMenu && <Settings /> }
         </>
}

FloatingMenus.propTypes = {
  visible: PropTypes.shape({
    editNodeMenu: PropTypes.bool.isRequired,
    editEdgeMenu: PropTypes.bool.isRequired,
    editCaptionMenu: PropTypes.bool.isRequired,
    settingsMenu: PropTypes.bool.isRequired
  })
}

export const mapStateToProps = state => {
  let editor = state.display.editor

  return {
    visible: {
      editNodeMenu:    Boolean(editor.tool === 'node' && editor.editNode),
      editEdgeMenu:    Boolean(editor.tool === 'edge' && editor.editEdge),
      editCaptionMenu: Boolean(editor.tool === 'text' && editor.editCaption),
      settingsMenu:    editor.tool === 'settings'
    }
  }
}

export default connect(mapStateToProps)(FloatingMenus)
