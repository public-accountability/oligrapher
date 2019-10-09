import { combineReducers } from 'redux'
import graph from './reducers/graph'
import display from './reducers/display'
import selection from './reducers/selection'
import settings from './reducers/settings'
import hooks from './reducers/hooks'
import attributes from './reducers/attributes.js'

export default combineReducers({
  graph,
  display,
  selection,
  settings,
  hooks,
  attributes
})
