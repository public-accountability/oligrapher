import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'

export function FloatingMenus({visible}) {
  return <>
           { visible.editNodeMenu && <EditNodeMenu /> }
           { visible.editEdgeMenu && <EditEdgeMenu /> }
         </>
}

FloatingMenus.propTypes = {
  visible: PropTypes.shape({
    editNodeMenu: PropTypes.bool.isRequired,
    editEdgeMenu: PropTypes.bool.isRequired
  })
}

export const mapStateToProps = state => {
  let editor = state.display.editor

  return {
    visible: {
      editNodeMenu: Boolean(editor.tool === 'node' && editor.editNode),
      editEdgeMenu: Boolean(editor.tool === 'edge' && editor.editEdge)
    }
  }
}

export default connect(mapStateToProps)(FloatingMenus)
