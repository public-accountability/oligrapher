import React from "react"
import { useSelector } from "../util/helpers"
import Caption from "./Caption"
import Caption2 from "./Caption2"
import FloatingEditor from "../util/floatingEditor"
import { annotationHasHighlightsSelector, highlightedCaptionIdsSelector } from "../util/selectors"
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
  const captions = useSelector<State>(state => state.graph.captions)
  const editedCaptionId = useSelector<State>(state =>
    FloatingEditor.getId(state.display, "caption")
  )
  const highlightedCaptionIds = useSelector(highlightedCaptionIdsSelector)
  const annotationHasHighlights = useSelector(annotationHasHighlightsSelector)
  const editMode = useSelector<State>(state => state.display.modes.editor)

  return (
    <g className="captions">
      {Object.entries(captions).map(([id, caption]) => (
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
