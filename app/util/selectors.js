export const userIsOwnerSelector = state => {
  return state.attributes.user 
    && (!state.attributes.owner || state.attributes.owner.id === state.attributes.user.id)
}

export const userIsEditorSelector = state => {
  return state.attributes.user
    && state.attributes.editors.filter(e => !e.pending).map(e => e.name).includes(state.attributes.user.name)
}

export const userCanEditSelector = state => {
  return userIsOwnerSelector(state) || userIsEditorSelector(state)
}

export const paramsForSaveSelector = state => {
  return {
    id: Number(state.attributes.id),
    graph_data: state.graph.present,
    attributes: {
      title: state.attributes.title,
      description: state.attributes.subtitle,
      is_private: state.attributes.settings.private,
      is_cloneable: state.attributes.settings.clone,
      settings: JSON.stringify(state.attributes.settings)
    }
  }
}