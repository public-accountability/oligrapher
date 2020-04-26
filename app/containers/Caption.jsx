import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'
import EditCaptionTextarea from './EditCaptionTextarea'
import FloatingMenu from '../util/floatingMenu'

export default function Caption({ id }) {
  const dispatch = useDispatch()
  const caption = useSelector(state => state.graph.captions[id])
  const isBeingEdited = useSelector(state => id === FloatingMenu.getId(state, 'caption'))
  const { width, height } = caption
  const foreignObjectWidth = isBeingEdited ? 1000 : width + 25
  const foreignObjectHeight = isBeingEdited ? 1000 : height + 25

  const clickCaption = useCallback(() => dispatch({ type: 'CLICK_CAPTION', id }), [dispatch, id])
  const updateCaption = useCallback(attributes => dispatch({ type: 'UPDATE_CAPTION', attributes, id }), [dispatch, id])
  const moveCaption = useCallback(deltas => dispatch({ type: 'MOVE_CAPTION', deltas, id }), [dispatch, id])

  return (
    <DraggableComponent
      disabled={isBeingEdited}
      enableUserSelectHack={isBeingEdited}
      onStop={moveCaption}
      onClick={clickCaption}
      handle=".oligrapher-caption">
      <g className="oligrapher-caption" id={`caption-${id}`} >
        <foreignObject 
          x={Math.round(caption.x)} 
          y={Math.round(caption.y)} 
          width={foreignObjectWidth} 
          height={foreignObjectHeight}>
          { isBeingEdited && <EditCaptionTextarea caption={caption} updateCaption={updateCaption} /> }
          { !isBeingEdited && <CaptionTextbox caption={caption} /> }
        </foreignObject>
      </g>
    </DraggableComponent>
  )
}

Caption.propTypes = {
  id: PropTypes.string.isRequired
}