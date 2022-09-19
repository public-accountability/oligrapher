import React from 'react'
import Edge from './Edge'
import FloatingEditor from '../util/floatingEditor'
import { useSelector } from 'react-redux'
import { State } from '../util/defaultState'

// <g className="edges">
//  <Edge />
//  <Edge />
export default function Edges() {
  const editedEdgeId =  useSelector<State>(state => FloatingEditor.getId(state.display, 'edge'))

  const elements = useSelector<State, string[]>(state => Object.keys(state.graph.edges))
    .map(id => ({ id: id, key: id, currentlyEdited: id === editedEdgeId }))
    .map(props =>  React.createElement(Edge, props))

  return React.createElement('g', { className: "edges" }, elements)
}
