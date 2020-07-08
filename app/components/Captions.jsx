import React, { useMemo } from 'react'

import { useSelector, calculateStatus } from '../util/helpers'
import Caption from './Caption'
import FloatingEditor from '../util/floatingEditor'
import { annotationHasHighlightsSelector } from '../util/selectors'

export default function Captions() {
  const captions = useSelector(state => state.graph.captions)
  const editedCaptionId = useSelector(state => FloatingEditor.getId(state.display, 'caption'))
  const storyMode = useSelector(state => state.display.modes.story)
  const { list, currentIndex } = useSelector(state => state.annotations)
  const highlightedCaptionIds = useMemo(
    () => storyMode ? (list[currentIndex]?.captionIds || []) : [],
    [storyMode, list, currentIndex]
  )
  const annotationHasHighlights = useSelector(annotationHasHighlightsSelector)
  const editMode = useSelector(state => state.display.modes.editor)

  return (
    <g className="captions">
      { Object.entries(captions).map(([id, caption]) => (
        <Caption 
          key={id} 
          caption={caption} 
          currentlyEdited={id === editedCaptionId} 
          status={calculateStatus(id, highlightedCaptionIds, annotationHasHighlights, editMode)} />
      )) }
    </g>
  )
}