import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { classNames } from '../util/helpers'
import noop from 'lodash/noop'

import EditorMenu from './EditorMenu'
import NodeTool from '../components/tools/Node'

/*
  Container for the editing interfaces
*/
export function Editor(props) {
  if (props.disabled) { return <></> }

  return <div className={props.className} onClick={props.onClick}>
           <EditorMenu />
           { props.nodeTool && <NodeTool /> }
         </div>
}

Editor.propTypes = {
  disabled: PropTypes.bool.isRequired,
  nodeTool: PropTypes.bool.isRequired,
  textTool: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

Editor.defaultProps = {
  onClick: noop
}

const textToolClick = (evt) => {
  console.log('clicked on text tool')
  console.log(evt)
}

const mapStateToProps = function(state) {
  const disabled =  !state.display.modes.editor
  const textTool = state.display.editor.tool === 'text'
  const nodeTool = state.display.editor.tool === 'node'
  const classes = ['oligrapher-graph-editor']
  let onClick

  if (textTool) {
    classes.push('text-tool')
    onClick = textToolClick
  }

  return { textTool,
           nodeTool,
           disabled,
           onClick,
           className: classNames(...classes)
  }
}

export default connect(mapStateToProps)(Editor)
