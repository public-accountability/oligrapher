import merge from 'lodash/merge'
import { getElementById } from '../helpers'
import defaultState from './defaultState'
import Graph from '../graph/graph'


/*
  Transforms oligrapher's serialized state (plain json) into correct format
  and/or converts legacy data.

  This looks a lot like a reducer, but it's intended to be called once upon
  initialization from an external data source.
*/
export default function stateInitalizer(serializedState) {
  let state = merge({}, defaultState, serializedState)
  state.graph = Graph.new(serializedState.graph)
  state.settings.rootElement = getElementById(state.settings.domId)
  return state
}
