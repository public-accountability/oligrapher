import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DraggableComponent from './DraggableComponent'
import CaptionTextbox from './CaptionTextbox'
import CaptionEditorTextarea from './CaptionEditorTextarea'
import { Caption } from '../graph/caption'

type CaptionPropTypes = {
  caption: Caption,
  status: string,
  currentlyEdited: boolean | undefined
}

export default function Caption({ caption, currentlyEdited, status }: CaptionPropTypes) {
  const { id, x, y, width, height } = caption
  const [foreignObjectSize, setForeignObjectSize] = useState({ width, height })
  const isHighlighting = useSelector(state => state.annotations.isHighlighting)

  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    if (isHighlighting) {
      dispatch({ type: 'SWAP_CAPTION_HIGHLIGHT', id })
    } else {
      dispatch({ type: 'CLICK_CAPTION', id })
    }
  }, [id, isHighlighting])

  const updateCaption = useCallback(attributes => dispatch({ type: 'UPDATE_CAPTION', attributes, id }), [dispatch, id])
  const moveCaption = useCallback(deltas => dispatch({ type: 'MOVE_CAPTION', deltas, id }), [dispatch, id])

  return (
    <DraggableComponent
      disabled={currentlyEdited}
      enableUserSelectHack={currentlyEdited}
      onStop={moveCaption}
      onClick={onClick}
      handle=".oligrapher-caption">
      <g className="oligrapher-caption" id={`caption-${id}`} >
        <foreignObject
          x={Math.round(x)}
          y={Math.round(y)}
          width={foreignObjectSize.width}
          height={foreignObjectSize.height}>
          { currentlyEdited &&
            <CaptionEditorTextarea
              caption={caption}
              updateCaption={updateCaption}
              setForeignObjectSize={setForeignObjectSize} />
          }
          { !currentlyEdited && <CaptionTextbox caption={caption} status={status} /> }
        </foreignObject>
      </g>
    </DraggableComponent>
  )
}
