import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditorMenu from './EditorMenu'

/*
  Container for the editing interfaces
*/
export function Editor(props) {
  if (props.disabled) { return <></> }

  return <div className="oligrapher-graph-editor">
           <EditorMenu />
         </div>
}

Editor.propTypes = {
  "disabled": PropTypes.bool.isRequired
}

const mapStateToProps = function(state) {
  return {
    "disabled": !state.display.modes.editor
  }
}


export default connect(mapStateToProps)(Editor)
