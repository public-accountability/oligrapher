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
  Transforms oligrapher's serialized state (plain json)
  into correct format and/or converts legacy data.

  Serialization really just means some objects, particularly
  graph elements, are turned into our custom classes.

  This looks a lot like a reducer, but it's intended
  to be called once upon initialization from
  an external data source

*/
export default function stateInitalizer(serializedState) {
  return produce(serializedState, draft => {
    merge(draft, defaultState)
    draft.graph.nodes = mapValues(draft.graph.nodes, n => new Node(n))
    draft.graph.edges = mapValues(draft.graph.edges, e => loadEdge(e, draft.graph.nodes))
    draft.graph = new Graph(draft.graph)
    draft.settings.rootElement = getElementById(draft.settings.domId)
  })
}
