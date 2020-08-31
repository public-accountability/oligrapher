import { combineReducers } from 'redux'

import graphReducer from './reducers/graphReducer'
import annotationsReducer from './reducers/annotationsReducer'
import displayReducer from './reducers/displayReducer'
import attributesReducer from './reducers/attributesReducer'
import lastSavedDataReducer from './reducers/lastSavedDataReducer'

export default combineReducers({
  graph: graphReducer,
  annotations: annotationsReducer,
  display: displayReducer,
  attributes: attributesReducer,
  settings: (settings = null) => settings,
  lastSavedData: lastSavedDataReducer
})