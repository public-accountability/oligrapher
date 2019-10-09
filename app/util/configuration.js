import merge from 'lodash/merge'
import omit from 'lodash/omit'

import defaultState from './defaultState'
import Graph from '../models/Graph'

/*
  This function takes a configuration object provided by the user,
  merges it with the default value and validates it.

  `new Graph()` converts the plain object into a Graph model (see models/Graph)

  This configuration becomes the initial redux store state.
*/
export default function(userConfig) {
  return merge({ graph: new Graph(userConfig.graph) },
               omit(userConfig, 'graph'),
               omit(defaultState, 'graph'))
}
