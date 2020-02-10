import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import noop from 'lodash/noop'

import { classNames } from '../util/helpers'

import EditorMenu from './EditorMenu'
import Settings from './Settings'
import NodeTool from '../components/tools/Node'


/*
  Container for the editing interfaces
*/
export function Editor(props) {
  if (props.disabled) { return null }

  const textTool = props.openTool === 'text'
  const nodeTool = props.openTool === 'node'
  const settings = props.openTool === 'settings'

  return <div className={props.className} onClick={textTool ? props.onClick : noop}>
           <EditorMenu />
           { nodeTool && <NodeTool /> }
           { settings && <Settings /> }
         </div>
}

Editor.propTypes = {
  disabled: PropTypes.bool.isRequired,
  openTool: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]).isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

const mapStateToProps = function(state) {
  const disabled =  !state.display.modes.editor
  const openTool = state.display.editor.tool
  const classes = ['oligrapher-graph-editor']

  if (openTool === 'text') {
    classes.push('text-tool')
  }

  return {
    openTool,
    disabled,
    className: classNames(...classes)
  }
}

// const newCaptionAction = event => {
//   event.persist()
//   return {
//     type: 'NEW_CAPTION',
//     event: event
//   }
// }

// const mapDispatchToProps = dispatch => ({
//   onClick: event => {
//     console.log('event to create caption')
//     let action = newCaptionAction(event)
//     console.log('caption action', action)
//     dispatch(action)
//   }
// })

export default connect(mapStateToProps)(Editor)
