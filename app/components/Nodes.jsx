import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

import NodeSelection from './NodeSelection'
import Node from './Node'
import FloatingEditor from '../util/floatingEditor'
import { getSelection } from '../util/selection'
import { calculateStatus, eventTargetIsFormElement } from '../util/helpers'
import { annotationHasHighlightsSelector } from '../util/selectors'

export function Nodes(props) {
  const { 
    nodes, editedNodeId, draggedNodeId, selectedNodeIds, 
    highlightedNodeIds, annotationHasHighlights, editMode,
    floatingEditorIsOpen, removeNodes
  } = props

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
  }, null, [editMode, floatingEditorIsOpen, selectedNodeIds])

  return (
    <g className="nodes">
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
  )
}

Nodes.propTypes = {
  nodes: PropTypes.object.isRequired,
  editedNodeId: PropTypes.string,
  draggedNodeId: PropTypes.string,
  selectedNodeIds: PropTypes.array.isRequired,
  highlightedNodeIds: PropTypes.array.isRequired,
  annotationHasHighlights: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  floatingEditorIsOpen: PropTypes.bool.isRequired,
  removeNodes: PropTypes.func.isRequired
}

const mapStateToProps = state => {
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

const mapDispatchToProps = dispatch => {
  return {
    removeNodes: ids => dispatch({ type: 'REMOVE_NODES', ids })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nodes)