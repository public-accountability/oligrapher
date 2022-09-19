import { EdgeStatusType } from "../graph/edge"
import { State } from "./defaultState"
import { annotationHasHighlightsSelector } from './selectors'

export function calculateAppearance(id: string, highlightedIds: string[], annotationHasHighlights: boolean, editMode: boolean): EdgeStatusType {
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


export function getEdgeAppearance(id: string, state: State): EdgeStatusType  {
  const highlightedIds = state.display.modes.story ? (state.annotations.list[state.annotations.currentIndex]?.edgeIds || []) : []
  const annotationHasHighlights = annotationHasHighlightsSelector(state)
  const editMode = Boolean(state.display.modes.editor)
  return calculateAppearance(id, highlightedIds, annotationHasHighlights, editMode)
}
