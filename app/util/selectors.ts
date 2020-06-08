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

export const paramsForSaveSelector = (state: StateWithHistory): LsMap => {
  return {
    id: Number(state.attributes.id),
    graph_data: state.graph.present,
    attributes: {
      title: state.attributes.title as string,
      description: state.attributes.subtitle as string,
      is_private: state.attributes.settings.private,
      is_cloneable: state.attributes.settings.clone,
      settings: JSON.stringify(state.attributes.settings),
      annotations_data: JSON.stringify(state.annotations.list)
    }
  }
}