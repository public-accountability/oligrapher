import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'
import EditCaptionTextarea from './EditCaptionTextarea'

export default function Caption({ caption, currentlyEdited }) {
  const dispatch = useDispatch()
  const { id, x, y, width, height } = caption

  const clickCaption = useCallback(() => dispatch({ type: 'CLICK_CAPTION', id }), [dispatch, id])
  const updateCaption = useCallback(attributes => dispatch({ type: 'UPDATE_CAPTION', attributes, id }), [dispatch, id])
  const moveCaption = useCallback(deltas => dispatch({ type: 'MOVE_CAPTION', deltas, id }), [dispatch, id])

  const [foreignObjectSize, setForeignObjectSize] = useState({ width, height })

  return (
    <DraggableComponent
      disabled={currentlyEdited}
      enableUserSelectHack={currentlyEdited}
      onStop={moveCaption}
      onClick={clickCaption}
      handle=".oligrapher-caption">
      <g className="oligrapher-caption" id={`caption-${id}`} >
        <foreignObject 
          x={Math.round(x)} 
          y={Math.round(y)} 
          width={foreignObjectSize.width} 
          height={foreignObjectSize.height}>
          { currentlyEdited &&
            <EditCaptionTextarea
              caption={caption}
              updateCaption={updateCaption}
              setForeignObjectSize={setForeignObjectSize} />
          }
          { !currentlyEdited && <CaptionTextbox caption={caption} /> }
        </foreignObject>
      </g>
    </DraggableComponent>
  )
}

Caption.propTypes = {
  caption: PropTypes.object.isRequired,
  currentlyEdited: PropTypes.bool
}

Caption.defaultProps = {
  currentlyEdited: false
}