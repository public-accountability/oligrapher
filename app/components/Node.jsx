import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector, isLittleSisId } from '../util/helpers'
import DraggableComponent from './DraggableComponent'
import NodeHalo from './NodeHalo'
import NodeCircle from './NodeCircle'
import NodeImage from './NodeImage'
import NodeLabel from './NodeLabel'
import ConditionalLink from './ConditionalLink'

export function Node({ id, currentlyEdited, selected, status }) {
  const dispatch = useDispatch()
  const node = useSelector(state => state.graph.nodes[id])
  const name = node?.name // avoids error in case node isn't present due to zombie child problem,
                          // see comment below
  const editMode = useSelector(state => state.display.modes.editor)
  const { isSelecting } = useSelector(state => state.display.selection)
  const { isHighlighting } = useSelector(state => state.annotations)
  const selectedNodeIds = useSelector(state => state.display.selection.node)
  const isMultipleSelection = selected && selectedNodeIds.length > 1
  const showSelection = editMode && (selected || currentlyEdited)

  const moveNode = useCallback(deltas => {
    if (isMultipleSelection) {
      return false
    } else {
      dispatch({ type: 'RELEASE_NODE', id, deltas })
    }
  }, [dispatch, id, isMultipleSelection])

  // the id in the payload, while otherwise redundant, allows redux-undo 
  // to group drag actions into a single action
  const dragNode = useCallback(deltas => {
    if (isMultipleSelection) {
      return false
    } else {
      dispatch({ type: 'DRAG_NODE', id, node, deltas })
    }
  }, [dispatch, id, node, isMultipleSelection])

  const clickNode = useCallback(event => {
    if (!editMode && node.url) {
      // Draggable prevents ordinary click events coming from its drag handle elements,
      // so we have to open the link programmatically
      window.open(node.url, "_blank")
    } else if (isSelecting) {
      dispatch({ type: 'SWAP_NODE_SELECTION', id })
    } else if (isHighlighting) {
      dispatch({ type: 'SWAP_NODE_HIGHLIGHT', id })
    } else {
      dispatch({ type: 'CLICK_NODE', id })
    }
  }, [dispatch, isSelecting, isHighlighting, id, editMode, node])

  const onMouseEnter = useCallback(() => { 
    dispatch({ type: 'MOUSE_ENTERED_NODE', name })
  }, [dispatch, name])

  const onMouseLeave = useCallback(() => { 
    dispatch({ type: 'MOUSE_LEFT_NODE' })
  }, [dispatch])

  // ordinarily the node should always be present, but when removing selected nodes we encounter the 
  // zombie child problem: https://react-redux.js.org/api/hooks#stale-props-and-zombie-children
  if (!node) {
    return null
  }

  return (
    <DraggableComponent
      handle=".draggable-node-handle"
      onStop={moveNode}
      onClick={clickNode}
      onDrag={dragNode}>
      <g 
        id={"node-" + id} 
        className="oligrapher-node"
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}
        onDragOver={onMouseEnter}
        onDragLeave={onMouseLeave}
      >
        <ConditionalLink 
          condition={!editMode && node.url} 
          href={node.url} 
          target="_blank" rel="noopener noreferrer"
          onDragStart={e => e.preventDefault()} // to prevent HTML5 drag-n-drop (draggable="false" used to work)
        >
          { node.description && <title>{node.description}</title> }
          <ConditionalLink condition={editMode && node.url} href={node.url} target="_blank" rel="noopener noreferrer">
            <NodeLabel node={node} status={status} />
          </ConditionalLink>
          <NodeHalo node={node} selected={showSelection} highlighted={status === "highlighted"} />
          <NodeCircle node={node} status={status} />
          <NodeImage node={node} status={status} />
        </ConditionalLink>
      </g>
    </DraggableComponent>
  )
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  currentlyEdited: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired
}

export default React.memo(Node)