import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { getElementById } from '../helpers'

import defaultState from './defaultState'
import Graph from '../models/Graph'

/*
  This function takes a configuration object provided by the user,
  merges it with the default value and validates it.

  `new Graph()` converts the plain object into a Graph model (see models/Graph)

  This configuration becomes the initial redux store state.
*/
export default function(userConfig) {
  // Merge user provided configuration with default state
  let config = merge({}, omit(defaultState, 'graph'), omit(userConfig, 'graph'))
  // Fetch the DOM element and store it
  config.settings.rootElement = getElementById(config.settings.domId)
  // Set the graph model.
  //  This will create a new blank graph if it doesn't yet exist
  config.graph = new Graph(userConfig?.graph)
  return config
}
