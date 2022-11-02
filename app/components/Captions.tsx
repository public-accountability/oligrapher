import React from "react"
import { useSelector } from "../util/helpers"
import Caption from "./Caption"
import {
  editModeSelector,
  annotationHasHighlightsSelector,
  highlightedCaptionIdsSelector,
  editedCaptionIdSelector,
} from "../util/selectors"
import { State } from "../util/defaultState"

type CaptionAppearance = "normal" | "highlighted" | "faded"

function calculateAppearance(
  id: string,
  highlightedIds: string[],
  annotationHasHighlights: boolean
): CaptionAppearance {
  if (annotationHasHighlights) {
    if (highlightedIds.includes(id)) {
      return "highlighted"
    } else {
      return "faded"
    }
  } else {
    return "normal"
  }
}

export default function Captions() {
  const captions = useSelector<State>(state => Object.entries(state.graph.captions))
  const editedCaptionId = useSelector(editedCaptionIdSelector)
  const highlightedCaptionIds = useSelector(highlightedCaptionIdsSelector)
  const annotationHasHighlights = useSelector(annotationHasHighlightsSelector)
  const editMode = useSelector(editModeSelector)

  return (
    <g className="captions">
      {captions.map(([id, caption]) => (
        <Caption2
          key={id}
          caption={caption}
          currentlyEdited={editMode && id === editedCaptionId}
          status={calculateAppearance(id, highlightedCaptionIds, annotationHasHighlights)}
        />
      ))}
    </g>
  )
}
