import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import noop from 'lodash/noop'
import pick from 'lodash/pick'

import { classNames } from '../util/helpers'

import Caption from '../graph/caption'
import EditorMenu from './EditorMenu'
import NodeTool from '../components/tools/Node'

/*
  Container for the editing interfaces
*/
export function Editor(props) {
  if (props.disabled) { return <></> }

  return <div className={props.className} onClick={props.textTool ? props.onClick : noop}>
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

const mapStateToProps = function(state) {
  const disabled =  !state.display.modes.editor
  const textTool = state.display.editor.tool === 'text'
  const nodeTool = state.display.editor.tool === 'node'
  const classes = ['oligrapher-graph-editor']

  if (textTool) {
    classes.push('text-tool')
  }

  return { textTool,
           nodeTool,
           disabled,
           className: classNames(...classes)
  }
}

const newCaptionAction = event => {
  event.persist()
  return {
    type: 'NEW_CAPTION',
    event: event
  }
}

const mapDispatchToProps = dispatch => ({
  onClick: event => {
    console.log('event to create caption')
    let action = newCaptionAction(event)
    console.log('caption action', action)
    dispatch(action)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
