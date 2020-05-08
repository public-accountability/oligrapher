export const userIsOwnerSelector = state => {
  return state.attributes.user 
    && (!state.attributes.owner || state.attributes.owner.id === state.attributes.user.id)
}