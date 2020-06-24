import { StateWithHistory } from './defaultState'
import { LsMap } from '../datasources/littlesis3'

export type Selector = (state: StateWithHistory) => any

export const userIsOwnerSelector: Selector = state => {
  return state.attributes.user
    && (!state.attributes.owner || state.attributes.owner.id === state.attributes.user.id)
}

export const userIsEditorSelector: Selector = state => {
  return state.attributes.user
    && state.attributes.editors.filter(e => !e.pending).map(e => e.name).includes(state.attributes.user.name)
}

export const userCanEditSelector: Selector = state => {
  return userIsOwnerSelector(state) || userIsEditorSelector(state)
}

export const annotationsListSelector: Selector = state => {
  const { list_sources } = state.attributes.settings
  const { list, sources } = state.annotations
  const editing = state.display.modes.editor
  
  return (!editing && list_sources && sources) ? list.concat([sources]) : list
}

export const showAnnotationsSelector: Selector = state => {
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

export const paramsForSaveSelector = (state: StateWithHistory): LsMap => {
  return {
    id: Number(state.attributes.id),
    graph_data: state.graph.present,
    attributes: {
      title: state.attributes.title as string,
      description: state.attributes.subtitle as string,
      is_private: state.attributes.settings.private,
      is_cloneable: state.attributes.settings.clone,
      list_sources: state.attributes.settings.list_sources,
      settings: JSON.stringify(state.attributes.settings),
      annotations_data: JSON.stringify(state.annotations.list)
    }
  }
}