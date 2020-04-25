import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import noop from 'lodash/noop'

import { classNames } from '../util/helpers'
import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'
import EditCaptionTextarea from './EditCaptionTextarea'
import FloatingMenu from '../util/floatingMenu'

export function Caption(props) {
  const className = classNames('caption', props.isBeingEdited ? 'focused' : null)
  const foreignObjectWidth = props.isBeingEdited ? 1000 : props.caption.width + 25
  const foreignObjectHeight = props.isBeingEdited ? 1000 : props.caption.height + 25

  return (
    <DraggableComponent 
      disabled={props.isBeingEdited}
      enableUserSelectHack={props.isBeingEdited}
      scale={props.draggableScale}
      onStop={props.moveCaption}
      onDrag={noop}
      onClick={props.clickCaption}
      handle=".caption">

      <g className={className} id={`caption-${props.id}`} >

        {/*
            This is something of a hack because SVG elements cannot be
            easily made editiable like html divs or inputs.
            It uses a lesser-known react feature called portals to render an invisible <input>
            into an empty divin <FloatingMenu>.
        */}

        {/* { props.isBeingEdited && ReactDOM.createPortal(
            <textarea value={props.text}
              onChange={handleTextChange}
              ref={inputRef} />,
            getElementById('caption-text-input')
        ) } */}

        <foreignObject x={Math.round(props.caption.x)} y={Math.round(props.caption.y)} width={foreignObjectWidth} height={foreignObjectHeight}>
          { props.isBeingEdited
            ? <EditCaptionTextarea caption={props.caption} updateCaption={props.updateCaption} />
            : <CaptionTextbox caption={props.caption} />
          }
        </foreignObject>
      </g>
    </DraggableComponent>
  )
}

Caption.propTypes = {
  // Caption Attributes
  id: PropTypes.string.isRequired,
  caption: PropTypes.object.isRequired,
  // Action Functions
  updateCaption: PropTypes.func.isRequired,
  moveCaption: PropTypes.func.isRequired,
  clickCaption: PropTypes.func.isRequired,
  // Other fields from store
  draggableScale: PropTypes.number.isRequired,
  isBeingEdited: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    caption: state.graph.captions[ownProps.id],
    isBeingEdited: ownProps.id == FloatingMenu.getId(state, 'caption'),
    draggableScale: state.display.actualZoom / state.display.zoom
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  clickCaption: () => dispatch({type: 'CLICK_CAPTION', id: ownProps.id }),
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
