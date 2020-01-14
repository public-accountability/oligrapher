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

const mapStateToProps = state => {
  return {
    visible: {
      editNodeMenu: Boolean(state.display.editor.tool === 'node' && state.display.editor.editNode),
      editEdgeMenu: false
    }
  }
}

export default connect(mapStateToProps)(FloatingMenus)
