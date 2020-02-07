import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { classNames } from '../util/helpers'
import isEqual from 'lodash/isEqual'
import noop from 'lodash/noop'

import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'

export function Caption(props) {
  const handleTextChange = event => props.updateCaption({ text: event.target.value })

  const className = classNames('caption', props.isFocused ? 'focused' : null)

  return <DraggableComponent actualZoom={props.actualZoom}
                             onStop={props.moveCaption}
                             onDrag={noop}
                             onClick={props.openEditMenu}
                             handle=".caption">
           <g className={className} id={`caption-${props.id}`} >
             <CaptionTextbox x={props.x}
                             y={props.y}
                             text={props.text}
                             handleTextChange={handleTextChange}
                             actualZoom={props.actualZoom}
             />
           </g>
         </DraggableComponent>
}

Caption.propTypes = {
  // Caption Attributes
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  // Action Functions
  updateCaption: PropTypes.func.isRequired,
  moveCaption: PropTypes.func.isRequired,
  openEditMenu: PropTypes.func.isRequired,
  // Other fields from store
  actualZoom: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.graph.captions[ownProps.id],
    isFocused: isEqual(state.display.editor.tool, 'text') && isEqual(state.display.editor.editCaption, ownProps.id),
    actualZoom: state.graph.actualZoom,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openEditMenu: () => dispatch({type: 'OPEN_EDIT_CAPTION_MENU', id: ownProps.id }),
  updateCaption: attributes => dispatch({
    type: 'UPDATE_CAPTION',
    attributes: attributes,
    id: ownProps.id
  }),
  moveCaption: deltas => dispatch({
    type: 'MOVE_CAPTION',
    deltas: deltas,
    id: ownProps.id
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(Caption)
