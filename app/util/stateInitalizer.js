import mapValues from 'lodash/mapValues'
import merge from 'lodash/merge'
import produce from 'immer'

import { getElementById } from '../helpers'
import defaultState from './defaultState'
import Edge from '../models/Edge'
import Node from '../models/Node'
import Graph from '../models/Graph'



const loadEdge = function(attributes, nodes) {
  let edgeAttributes = produce(attributes, draft => {
    draft.node1 = nodes[draft.node1_id]
    draft.node2 = nodes[draft.node2_id]
  })

  return new Edge(edgeAttributes)
}


/*
  Transforms oligrapher's serialized state (plain json) into correct format
  and/or converts legacy data. Serialization here just means some objects,
  particularly graph elements, are turned into our custom classes.

  This looks a lot like a reducer, but it's intended to be called once upon
  initialization from an external data source.
*/
export default function stateInitalizer(serializedState) {
  let state = merge({}, defaultState, serializedState)
  state.graph.nodes = mapValues(state.graph.nodes, n => new Node(n))
  state.graph.edges = mapValues(state.graph.edges, e => loadEdge(e, state.graph.nodes))
  state.graph = new Graph(state.graph)
  state.settings.rootElement = getElementById(state.settings.domId)
  return state
}
