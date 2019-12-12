import React, { ReactDOM } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditorMenu from './EditorMenu'
import EditNodeMenu from './EditNodeMenu'
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
           { props.edit_node_menu_is_visible && <EditNodeMenu /> }
         </div>
}

Editor.propTypes = {
  disabled: PropTypes.bool.isRequired,
  tool_is_visible: PropTypes.bool.isRequired,
  edit_node_menu_is_visible: PropTypes.bool.isRequired,
  tool: PropTypes.string
}

const mapStateToProps = function(state) {
  const display = state.display
  const editor = display.editor

  return {
    disabled:                      !display.modes.editor,
    tool_is_visible:               Boolean(editor.tool),
    edit_node_menu_is_visible:     Boolean(editor.tool === 'node' && editor.editNode),
    tool:                          editor.tool
  }
}


export default connect(mapStateToProps)(Editor)
