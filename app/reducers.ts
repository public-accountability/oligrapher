import { combineReducers } from 'redux'

import graphReducer from './reducers/graphReducer'
import displayReducer from './reducers/displayReducer'
import attributesReducer from './reducers/attributesReducer'

export default combineReducers({
  graph: graphReducer,
  display: displayReducer,
  attributes: attributesReducer,
  settings: (settings = null) => settings
})