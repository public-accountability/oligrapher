import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditorMenu from './EditorMenu'

import Tool from '../components/Tool'

/*
  Container for the editing interfaces
*/
export function Editor(props) {
  if (props.disabled) { return <></> }

  return <div className="oligrapher-graph-editor">
           <div className="editor-menu-wrapper">
             <EditorMenu />
             { props.tool_is_visible && <Tool name={props.tool} /> }
           </div>
         </div>
}

Editor.propTypes = {
  disabled: PropTypes.bool.isRequired,
  tool_is_visible: PropTypes.bool.isRequired,
  tool: PropTypes.string
}

const mapStateToProps = function(state) {
  return {
    disabled:                      !state.display.modes.editor,
    tool_is_visible:               Boolean(state.display.editor.tool),
    tool:                          state.display.editor.tool
  }
}


export default connect(mapStateToProps)(Editor)
