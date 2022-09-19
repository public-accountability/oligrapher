import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { State, StateWithHistory } from '../util/defaultState'
import Node from './Node'

export default function Nodes() {
  // const editMode = useSelector<State>(state => state.display.modes.editor)
  const nodeIds = useSelector<State, Array<String>>(state => Object.keys(state.graph.nodes))

  // useHotkeys('backspace, del', event => {
  //   if (!eventTargetIsFormElement(event) && editMode && !floatingEditorIsOpen && selectedNodeIds.length > 0) {
  //     removeNodes(selectedNodeIds)
  //   }
  // }, undefined, [editMode, floatingEditorIsOpen, selectedNodeIds])

  const nodes = nodeIds.map(id => React.createElement(Node, { id: id, key: id }))
  return React.createElement('g', { className: "nodes"}, nodes)
}
