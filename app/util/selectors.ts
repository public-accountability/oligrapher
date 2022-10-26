import isEqual from "lodash/isEqual"
import isNil from "lodash/isNil"

import { DisplayModesState, State, FloatingEditorType, StateWithoutHistory } from "./defaultState"
import { Annotation } from "./annotations"
import { LsMap } from "../datasources/littlesis3"
import { Selector } from "react-redux"
import { Viewbox, calculateAnnotationViewBox } from "../graph/graph"

export function displayModesSelector(state: State): DisplayModesState {
  return state.display.modes
}

export function editModeSelector(state: State): boolean {
  return state.display.modes.editor
}

export function floatingEditorSelector(state: State): FloatingEditorType {
  return state.display.floatingEditor
}

export function showFloatingEditorsSelector(state: State): boolean {
  const floatingEditor = floatingEditorSelector(state)
  const editMode = editModeSelector(state)
  return Boolean(editMode && floatingEditor.id && floatingEditor.type)
}

export const showHeaderSelector = (state: State) => {
  return state.display.showHeader
}

export const headerIsCollapsedSelector = (state: State) => {
  return state.display.headerIsCollapsed
}

export const showZoomControlSelector: Selector<State, boolean> = state => {
  return state.display.showZoomControl
}

export const pannableSelector: Selector<State, boolean> = state => {
  return state.display.pannable
}

export const svgHeightSelector: Selector<State, number> = state => {
  return state.display.svgHeight
}

export const currentZoomSelector: Selector<State, number> = state => {
  return state.display.zoom
}

export const currentViewboxSelector: Selector<State, Viewbox> = state => {
  if (shouldRecalculateViewboxSelector(state)) {
    return calculateAnnotationViewBox(state.graph, currentAnnotationSelector(state))
  } else {
    return state.display.viewBox
  }
}

// do we need to recalculate the viewbox because of highlights?
export const shouldRecalculateViewboxSelector: Selector<State, boolean> = state => {
  return (
    !state.display.modes.editor &&
    state.display.modes.story &&
    annotationHasHighlightsSelector(state)
  )
}

export function userIsOwnerSelector(state: State): boolean {
  return (
    !!state.attributes?.user?.id &&
    !!state.attributes?.owner?.id &&
    state.attributes.owner.id === state.attributes.user.id
  )
}

export function userIsEditorSelector(state: State): boolean {
  return (
    !!state.attributes?.user?.id &&
    !!state.attributes?.editors &&
    state.attributes.editors
      .filter(e => !e.pending)
      .map(e => e.id)
      .includes(state.attributes.user.id)
  )
}

export function userCanEditSelector(state: State): boolean {
  if (state.settings.embed || state.settings.noEditing) {
    return false
  } else {
    return userIsOwnerSelector(state) || userIsEditorSelector(state)
  }
}

export function debugModeSelector(state: State): boolean {
  return state.attributes.settings.debug
}

export function scrollToZoomSelector(state: State): boolean {
  return state.attributes.settings.scrollToZoom
}

export function embedSelector(state: State) {
  return state.settings.embed
}

export function edgeDraggingEnabledSelector(state: State) {
  return state.display.modes.editor || state.attributes.settings.edgeDraggingWhenPresenting
}

// If List Sources is on, there is sources data, and we are not editing
// add the sources annotation to our list of annotations
export const annotationsListSelector = (state: State): Annotation[] => {
  if (
    !state.display.modes.editor &&
    state.attributes.settings.list_sources &&
    state.annotations.sources
  ) {
    return state.annotations.list.concat([state.annotations.sources])
  } else {
    return state.annotations.list
  }
}

export const hasAnnotationsSelector = (state: State): boolean => {
  return annotationsListSelector(state).length > 0
}

export const showAnnotationsSelector = (state: State): boolean => {
  const list = annotationsListSelector(state)
  const { editor: editMode, story: storyMode } = state.display.modes
  const { storyModeOnly, exploreModeOnly } = state.attributes.settings

  if (editMode) {
    return storyMode
  }

  if (exploreModeOnly) {
    return false
  }

  if (storyModeOnly || storyMode) {
    return list.length > 0
  }

  return false
}

export const currentAnnotationSelector: Selector<State, Annotation> = state => {
  const list = annotationsListSelector(state)
  const { currentIndex } = state.annotations
  return list[currentIndex]
}

export const annotationHasHighlightsSelector: Selector<State, boolean> = state => {
  if (!state.display.modes.story) {
    return false
  }

  const annotation = currentAnnotationSelector(state)
  return (
    Boolean(annotation) &&
    annotation.nodeIds.length + annotation.edgeIds.length + annotation.captionIds.length > 0
  )
}

export const enableLockSelector: Selector<State, boolean> = state => {
  const isOwner = userIsOwnerSelector(state)
  const { id, editors } = state.attributes

  return Boolean(id) && (!isOwner || editors.length > 0)
}

export const paramsForSaveSelector = (state: State): LsMap => {
  return {
    id: Number(state.attributes.id),
    graph_data: state.graph,
    attributes: {
      title: state.attributes.title,
      description: state.attributes.subtitle,
      is_private: state.attributes.settings.private,
      is_cloneable: state.attributes.settings.clone,
      list_sources: state.attributes.settings.list_sources,
      settings: JSON.stringify(state.attributes.settings),
      annotations_data: JSON.stringify(state.annotations.list),
    },
  }
}

// This function is used by <Root> to determine if the browser should display
// a popup warning the user that there are unsaved changes to their map
export const hasUnsavedChangesSelector = (state: State): boolean => {
  // when map is not in editor mode or when there is no previous data (i.e. unsaved maps)
  if (!state.display.modes.editor || isNil(state.lastSavedData)) {
    return false
  }

  const { lastSavedData } = state
  const latestData = paramsForSaveSelector(state)

  return !isEqual(lastSavedData, latestData)
}

export const pastHistorySelector = (state: State): StateWithoutHistory[] => state.history.past
export const futureHistorySelector = (state: State): StateWithoutHistory[] => state.history.future
