import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { StateWithHistory } from '../util/defaultState'
import NodeSelection from './NodeSelection'
import Node from './Node'
import FloatingEditor from '../util/floatingEditor'
import { getSelection } from '../util/selection'
import { calculateStatus, eventTargetIsFormElement } from '../util/helpers'
import { annotationHasHighlightsSelector } from '../util/selectors'

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
  const dispatch = useDispatch()

  const {
    nodes, editedNodeId, draggedNodeId, selectedNodeIds,
    highlightedNodeIds, annotationHasHighlights, editMode,
    floatingEditorIsOpen
  } = props

  const removeNodes = (ids: string[]): void => {
    dispatch({ type: 'REMOVE_NODES', ids })
  }

  let unselectedNodeIds = Object.keys(nodes).filter(id => !selectedNodeIds.includes(id))

  if (unselectedNodeIds.includes(draggedNodeId)) {
    // reorder so that dragged node is painted first
    let nonDraggedNodeIds = unselectedNodeIds.filter(id => id !== draggedNodeId)
    unselectedNodeIds = nonDraggedNodeIds.concat([draggedNodeId])
  }

  useHotkeys('backspace, del', event => {
    if (!eventTargetIsFormElement(event) && editMode && !floatingEditorIsOpen && selectedNodeIds.length > 0) {
      removeNodes(selectedNodeIds)
    }
  }, undefined, [editMode, floatingEditorIsOpen, selectedNodeIds])

  return <g className="nodes">
           { unselectedNodeIds.map(id => (
             <Node
               key={id}
               id={id}
               currentlyEdited={id === editedNodeId}
               selected={false}
               status={calculateStatus(id, highlightedNodeIds, annotationHasHighlights, editMode)} />
           )) }

           { selectedNodeIds.length > 0 &&
             <NodeSelection nodeIds={selectedNodeIds}>
               { selectedNodeIds.map(id => (
                 <Node
                   key={id}
                   id={id}
                   currentlyEdited={id === editedNodeId}
                   selected={true}
                   status={calculateStatus(id, highlightedNodeIds, annotationHasHighlights, editMode)} />
               )) }
             </NodeSelection>
           }
         </g>

}

const mapStateToProps = (state: StateWithHistory) => {
  const storyMode = state.display.modes.story
  const { list, currentIndex } = state.annotations

  return {
    nodes: state.graph.nodes,
    editedNodeId: FloatingEditor.getId(state.display, 'node'),
    draggedNodeId: state.display.draggedNode ? state.display.draggedNode.id : null,
    selectedNodeIds: getSelection(state.display, 'node'),
    highlightedNodeIds: storyMode ? (list[currentIndex]?.nodeIds || []) : [],
    annotationHasHighlights: annotationHasHighlightsSelector(state),
    editMode: state.display.modes.editor,
    floatingEditorIsOpen: state.display.floatingEditor.type !== null
  }
}

export default connect(mapStateToProps)(Nodes)
