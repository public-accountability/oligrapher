import isEqual from 'lodash/isEqual'

import { StateWithHistory } from './defaultState'
import { Annotation } from './annotations'
import { LsMap } from '../datasources/littlesis3'

export type Selector<T> = (state: StateWithHistory) => T

export const userIsOwnerSelector: Selector<boolean> = state => {
  return !!state.attributes.user
    && (!state.attributes.owner || state.attributes.owner.id === state.attributes.user.id)
}

export const userIsEditorSelector: Selector<boolean> = state => {
  return !!state.attributes.user
    && state.attributes.editors.filter(e => !e.pending).map(e => e.name).includes(state.attributes.user.name)
}

export const userCanEditSelector: Selector<boolean> = state => {
  return !state.settings.embed && (userIsOwnerSelector(state) || userIsEditorSelector(state))
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

export const hasUnsavedChangesSelector = (state: StateWithHistory): boolean => {
  const { lastSavedData } = state
  const latestData = paramsForSaveSelector(state)

  return !isEqual(lastSavedData, latestData)
}