import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { State, StateWithHistory } from '../util/defaultState'
import Node2 from './Node2'
import FloatingEditor from '../util/floatingEditor'
import { getSelection } from '../util/selection'
import { calculateStatus, eventTargetIsFormElement } from '../util/helpers'
import { annotationHasHighlightsSelector } from '../util/selectors'
import { getNodeUIState } from '../util/defaultState'


type NodesProps = {
  nodes: object,
  editedNodeId: string,
  draggedNodeId: string,
  selectedNodeIds: string[],
  highlightedNodeIds: string[],
  annotationHasHighlights: boolean,
  editMode: boolean,
  floatingEditorIsOpen: boolean
}

export function Nodes(props: NodesProps) {
  // const editMode = useSelector<State>(state => state.display.modes.editor)
  const nodeIds = useSelector<State, Array<String>>(state => Object.keys(state.graph.nodes))

  /* useHotkeys('backspace, del', event => {
   *   if (!eventTargetIsFormElement(event) && editMode && !floatingEditorIsOpen && selectedNodeIds.length > 0) {
   *     removeNodes(selectedNodeIds)
   *   }
   * }, undefined, [editMode, floatingEditorIsOpen, selectedNodeIds]) */

  return <g className="nodes">
    { nodeIds.map(id => <Node2 id={id} key={id} />) }
  </g>

}


export default Nodes
