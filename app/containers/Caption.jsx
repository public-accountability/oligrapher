import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { captionShape } from '../graph/caption'

import noop from 'lodash/noop'

import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'

export function Caption(props) {
  const handleTextChange = event => props.updateCaption({text: event.target.value})

  return <DraggableComponent actualZoom={props.actualZoom}
                             onStop={props.moveCaption}
                             onDrag={noop}
                             onClick={props.openEditMenu}
                             handle=".caption">
           <g className="caption" id={`caption-${props.id}`} >
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
  ...captionShape,
  actualZoom: PropTypes.number.isRequired,
  updateCaption: PropTypes.func.isRequired,
  moveCaption: PropTypes.func.isRequired,
  openEditMenu: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return { ...state.graph.captions[ownProps.id],
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
