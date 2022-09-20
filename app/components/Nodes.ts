import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { State, StateWithHistory } from '../util/defaultState'
import Node from './Node'

function getNodeIds(state: State): string[] {
  const draggedNode = state.display.draggedNode

  if (draggedNode) {
    return [draggedNode].concat(Object.keys(state.graph.nodes).filter(id => id !== draggedNode))
  } else {
    return Object.keys(state.graph.nodes)
  }
}

export default function Nodes({ svgRef }) {
  const nodeIds = useSelector<State>(getNodeIds)

  // useHotkeys('backspace, del', event => {
  //   if (!eventTargetIsFormElement(event) && editMode && !floatingEditorIsOpen && selectedNodeIds.length > 0) {
  //     removeNodes(selectedNodeIds)
  //   }
  // }, undefined, [editMode, floatingEditorIsOpen, selectedNodeIds])

  const nodes = nodeIds.map(id => React.createElement(Node, { svgRef, id, key: id }))
  return React.createElement('g', { className: "nodes"}, nodes)
}
