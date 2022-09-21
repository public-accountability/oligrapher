import isEqual from 'lodash/isEqual'
import isNil from 'lodash/isNil'

import { State } from './defaultState'
import { Annotation } from './annotations'
import { LsMap } from '../datasources/littlesis3'
import { Selector } from 'react-redux'

export function editModeSelector(state: State): Boolean {
  return state.display.modes.editor
}

export function userIsOwnerSelector(state: State): Boolean {
  return !!state.attributes?.user?.id &&
    !!state.attributes?.owner?.id &&
    (state.attributes.owner.id === state.attributes.user.id)
}

export function userIsEditorSelector(state: State): Boolean {
  return !!state.attributes?.user?.id &&
    !!state.attributes?.editors &&
    state.attributes.editors.filter(e => !e.pending).map(e => e.id).includes(state.attributes.user.id)
}

export function userCanEditSelector(state: State): Boolean {
  if (state.settings.embed || state.settings.noEditing) {
    return false
  } else {
    return userIsOwnerSelector(state) || userIsEditorSelector(state)
  }
}

// If List Sources is on, there is sources data, and we are not editing
// add the sources annotation to our list of annotations
export const annotationsListSelector = (state: State): Annotation[] => {
  if (!state.display.modes.editor && state.attributes.settings.list_sources && state.annotations.sources) {
    return state.annotations.list.concat([state.annotations.sources])
  } else {
    return state.annotations.list
  }
}

export const hasAnnotationsSelector = (state: State): Boolean => {
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

export const showHeaderSelector = (state: State) => {
  return state.display.showHeader
}

export const showZoomControlSelector: Selector<State, boolean> = state => {
  return state.display.showZoomControl
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

  if (!annotation) {
    return false
  }

  const { nodeIds, edgeIds, captionIds } = annotation
  return nodeIds.length + edgeIds.length + captionIds.length > 0
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
      annotations_data: JSON.stringify(state.annotations.list)
    }
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
