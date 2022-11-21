import isEqual from "lodash/isEqual"
import isNil from "lodash/isNil"

import {
  DisplayModesState,
  State,
  FloatingEditorType,
  StateWithoutHistory,
  InterlocksState,
} from "./defaultState"
import { Annotation } from "./annotations"
import { LsMap, urls } from "../datasources/littlesis"
import { Selector } from "react-redux"
import { Viewbox, calculateAnnotationViewBox } from "../graph/graph"
import { Caption } from "../graph/caption"
import { isLittleSisId } from "./helpers"
import { Point, polygonCenter } from "./geometry"

export function displayModesSelector(state: State): DisplayModesState {
  return state.display.modes
}

export function editModeSelector(state: State): boolean {
  return state.display.modes.editor
}

export function storyModeSelector(state: State): boolean {
  return state.display.modes.story
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

export const textToolOpenSelector: Selector<State, boolean> = state => {
  return state.display.tool === "text"
}

export const allowCreateNewCaptionSelector = (state: State) => {
  return state.display.tool === "text" && !state.display.openCaption
}

export const pannableSelector: Selector<State, boolean> = state => {
  return (
    state.attributes.settings.allowPanning &&
    !state.display.overNode &&
    state.display.tool !== "text" &&
    state.display.floatingEditor.type !== "caption"
  )
}

export const openCaptionSelector = (state: State): string | null => {
  return state.display.openCaption
}

export const captionEntriesSelector = (state: State) => {
  return Object.entries<Caption>(state.graph.captions)
}

export const svgScaleSelector: Selector<State, number> = state => {
  return state.display.svgScale
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

export const isEditingAnnotationsSelector: Selector<State, boolean> = state => {
  return state.display.modes.editor && state.display.modes.story
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

export function embeddedUrlSelector(state: State) {
  if (state.attributes.id) {
    return urls.embeddedOligrapher(state.attributes.id)
  } else {
    return ""
  }
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

export const highlightedCaptionIdsSelector: Selector<State, string[]> = state => {
  if (state.display.modes.story) {
    const currentAnnotation = state.annotations.list[state.annotations.currentIndex]
    if (currentAnnotation) {
      return currentAnnotation.captionIds
    }
  }

  return []
}

export const enableActionCableSelector: Selector<State, boolean> = state => {
  return !!state.attributes.id && userCanEditSelector(state)
}

export const userHasLockSelector: Selector<State, boolean> = state => {
  return (
    state.display.lock.locked &&
    state.attributes.user &&
    state.display.lock.user_id === state.attributes.user.id
  )
}

export const otherUserHasLockSelector: Selector<State, boolean> = state => {
  return state.display.lock.locked && state.display.lock.user_id !== state.attributes.user.id
}

export const lockUsernameSelector: Selector<State, string | null> = state => {
  if (state.display.lock.locked && state.display.lock.user_id) {
    if (state.display.lock.user_id === state.attributes.owner.id) {
      return state.attributes.owner.name
    } else {
      return state.attributes.editors.find(e => e.id === state.display.lock.user_id).name
    }
  } else {
    return null
  }
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
      oligrapher_commit: OLIGRAPHER_COMMIT,
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

export const interlocksStateSelector = (state: State): InterlocksState => {
  return state.display.interlocks
}

export const selectedLsNodesSelector = (state: State): string[] =>
  state.display.selection.node.filter(isLittleSisId)

export const interlocksSelectedCentroidSelector = (state: State): Point => {
  if (!state.display.interlocks.selectedNodes) {
    throw new Error("no nodes selected")
  }

  return polygonCenter(
    Object.values(state.graph.nodes).filter(n =>
      state.display.interlocks.selectedNodes.includes(n.id)
    )
  )
}
