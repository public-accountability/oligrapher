import React, { useMemo } from 'react'
import { useSelector } from '../util/helpers'
import Caption from './Caption'
import FloatingEditor from '../util/floatingEditor'
import { annotationHasHighlightsSelector } from '../util/selectors'
import { State } from '../util/defaultState'

function calculateAppearance(id: string, highlightedIds: string[], annotationHasHighlights: boolean, editMode: boolean): string {
  if (!annotationHasHighlights) {
    return "normal"
  }

  if (highlightedIds.includes(id)) {
    return "highlighted"
  }

  if (editMode) {
    return "normal"
  }

  return "faded"
}

export default function Captions() {
  const captions = useSelector<State>(state => state.graph.captions)
  const editedCaptionId = useSelector<State>(state => FloatingEditor.getId(state.display, 'caption'))
  const storyMode = useSelector<State>(state => state.display.modes.story)
  const { list, currentIndex } = useSelector<State>(state => state.annotations)
  const highlightedCaptionIds = useMemo(
    () => storyMode ? (list[currentIndex]?.captionIds || []) : [],
    [storyMode, list, currentIndex]
  )
  const annotationHasHighlights = useSelector(annotationHasHighlightsSelector)
  const editMode = useSelector<State>(state => state.display.modes.editor)

  return (
    <g className="captions">
      { Object.entries(captions).map(([id, caption]) => (
        <Caption
          key={id}
          caption={caption}
          currentlyEdited={editMode && id === editedCaptionId}
          status={calculateAppearance(id, highlightedCaptionIds, annotationHasHighlights, editMode)} />
      )) }
    </g>
  )
}
