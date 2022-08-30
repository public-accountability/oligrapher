import isEqual from 'lodash/isEqual'
import isNil from 'lodash/isNil'

import { StateWithHistory } from './defaultState'
import { Annotation } from './annotations'
import { LsMap } from '../datasources/littlesis3'


export function userIsOwnerSelector(state: StateWithHistory): Boolean {
  return !!state.attributes?.user?.id &&
    !!state.attributes?.owner?.id &&
    (state.attributes.owner.id === state.attributes.user.id)
}

export function userIsEditorSelector(state: StateWithHistory): Boolean {
  return !!state.attributes?.user?.id &&
    !!state.attributes?.editors &&
    state.attributes.editors.filter(e => !e.pending).map(e => e.id).includes(state.attributes.user.id)
}

export function userCanEditSelector(state: StateWithHistory): Boolean {
  if (state.settings.embed || state.settings.noEditing) {
    return false
  } else {
    return userIsOwnerSelector(state) || userIsEditorSelector(state)
  }
}

export const annotationsListSelector: Selector<Annotation[]> = state => {
  const { list_sources } = state.attributes.settings
  const { list, sources } = state.annotations
  const editing = state.display.modes.editor

  return (!editing && list_sources && sources) ? list.concat([sources]) : list
}

export const showAnnotationsSelector: Selector<boolean> = state => {
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

export const showHeaderSelector: Selector<boolean> = state => {
  return state.display.showHeader
}

export const showZoomControlSelector: Selector<boolean> = state => {
  return state.display.showZoomControl
}

export const currentAnnotationSelector: Selector<Annotation> = state => {
  const list = annotationsListSelector(state)
  const { currentIndex } = state.annotations
  return list[currentIndex]
}

export const annotationHasHighlightsSelector: Selector<boolean> = state => {
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

export const enableLockSelector: Selector<boolean> = state => {
  const isOwner = userIsOwnerSelector(state)
  const { id, editors } = state.attributes

  return Boolean(id) && (!isOwner || editors.length > 0)
}

export const paramsForSaveSelector = (state: StateWithHistory): LsMap => {
  return {
    id: Number(state.attributes.id),
    graph_data: state.graph.present,
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
export const hasUnsavedChangesSelector = (state: StateWithHistory): boolean => {
  // when map is not in editor mode or when there is no previous data (i.e. unsaved maps)
  if (!state.display.modes.editor || isNil(state.lastSavedData)) {
    return false
  }

  const { lastSavedData } = state
  const latestData = paramsForSaveSelector(state)

  return !isEqual(lastSavedData, latestData)
}
