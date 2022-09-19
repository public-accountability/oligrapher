import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DraggableComponent from './DraggableComponent'
import NodeHalo from './NodeHalo'
import NodeCircle from './NodeCircle'
import NodeImage from './NodeImage'
import NodeLabel from './NodeLabel'
import ConditionalLink from './ConditionalLink'
import { StateWithHistory } from '../util/defaultState'
import type { Node as NodeType } from '../graph/node'
import type { ControlPosition, DraggableEvent } from  'react-draggable'

type NodeProps = {
  id: string,
  currentlyEdited: boolean,
  selected: boolean,
  status: string
}

export function Node({ id, currentlyEdited, selected, status } : NodeProps) {
  const dispatch = useDispatch()
  const node = useSelector<StateWithHistory, NodeType>(state => state.graph.nodes[id])
  const editMode = useSelector<StateWithHistory>(state => state.display.modes.editor)
  const isSelecting = useSelector<StateWithHistory, boolean>(state => state.display.selection.isSelecting)
  const isHighlighting = useSelector<StateWithHistory, boolean>(state => state.annotations.isHighlighting)
  const selectedNodeIds = useSelector<StateWithHistory, string[]>(state => state.display.selection.node)
  const isMultipleSelection = selected && selectedNodeIds.length > 1
  const showSelection = Boolean(editMode && (selected || currentlyEdited))

  const moveNode = useCallback( (deltas: ControlPosition) => {
    if (isMultipleSelection) {
      return false
    } else {
      dispatch({ type: 'RELEASE_NODE', id, deltas })
    }
  }, [dispatch, id, isMultipleSelection])

  // the id in the payload, while otherwise redundant, allows redux-undo
  // to group drag actions into a single action
  const dragNode = useCallback( (deltas: ControlPosition)  => {
    if (isMultipleSelection) {
      return false
    } else {
      dispatch({ type: 'DRAG_NODE', id, node, deltas })
    }
  }, [dispatch, id, node, isMultipleSelection])

  const clickNode = useCallback( (event: DraggableEvent) => {
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
    dispatch({ type: 'MOUSE_ENTERED_NODE', name: node.name })
  }, [dispatch, node.name])

  const onMouseLeave = useCallback(() => {
    dispatch({ type: 'MOUSE_LEFT_NODE' })
  }, [dispatch])


  // to prevent HTML5 drag-n-drop (draggable="false" used to work)
  //const onDragStart = (e: DraggableEvent) => e.preventDefault()

  return (
    <DraggableComponent handle=".draggable-node-handle" onStop={moveNode} onClick={clickNode} onDrag={dragNode}>
      <g id={"node-" + id} className="oligrapher-node" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDragOver={onMouseEnter} onDragLeave={onMouseLeave}>
        <ConditionalLink condition={Boolean(!editMode && node.url)} url={node.url}>
          { node.description && <title>{node.description}</title> }
          <ConditionalLink condition={Boolean(editMode && node.url)} url={node.url}>
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

export default React.memo(Node)
