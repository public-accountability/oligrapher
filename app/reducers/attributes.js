import produce from 'immer'

/*
  {
    type: 'UPDATE_ATTRIBUTE'
    name: "title" | "subtitle"
    value: String
  }
*/

export default produce((state, action) => {
  switch(action.type) {
  case 'UPDATE_ATTRIBUTE':

    if (!['title', 'subtitle'].includes(action.name)) {
      throw new Error(`Unknown attribute: ${action.name}`)
    }

    state[action.name] = action.value
    return
  }
}, {})
