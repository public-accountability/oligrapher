import React from "react"
import { useSelector } from "../util/helpers"
import {
  annotationHasHighlightsSelector,
  captionEntriesSelector,
  highlightedCaptionIdsSelector,
} from "../util/selectors"
import Caption from "./Caption"

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
  const captions = useSelector(captionEntriesSelector)
  const highlightedCaptionIds = useSelector(highlightedCaptionIdsSelector)
  const annotationHasHighlights = useSelector(annotationHasHighlightsSelector)

  return (
    <g className="captions">
      {captions.map(([id, caption]) => (
        <Caption
          key={id}
          caption={caption}
          status={calculateAppearance(id, highlightedCaptionIds, annotationHasHighlights)}
        />
      ))}
    </g>
  )
}
