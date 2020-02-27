import parameters from './parameters'
import LittleSis from '../datasources/littlesis3'

const resetDelay = 10 * 1000
const saveMapReset = dispatch => dispatch({type: 'SAVE_MAP_RESET'})

export default function saveMapAction() {
  return function(dispatch, getState) {
    const data = parameters(getState())
    const requestType = data.id ? 'update' : 'create'

    dispatch({ type: "SAVE_MAP_IN_PROGRESS" })

    LittleSis
      .oligrapher[requestType](data)
      .then(res => {
        dispatch({ type: "SAVE_MAP_SUCCESS", response: res })
        setTimeout(saveMapReset, resetDelay, dispatch)
      })
      .catch(error => {
        console.error('Error saving map', error)
        dispatch({type: 'SAVE_MAP_FAILED'})
        setTimeout(saveMapReset, resetDelay, dispatch)
      })
  }
}
