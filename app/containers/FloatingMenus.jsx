import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import head from 'lodash/head'
import last from 'lodash/last'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'

const isVisible = x => head(x)
const render = x => last(x)()

export function FloatingMenus({visible}) {
  return [
    // is visible         // render function
    [ visible.editNodeMenu,  () => <EditNodeMenu key="node"/>  ],
    [ visible.editEdgeMenu,  () => <EditEdgeMenu key="edge"/>  ]
  ].map(isVisible)
   .map(render)
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
      editEdgeMenu: true
    }
  }
}

export default connect(mapStateToProps)(FloatingMenus)
