import React, { useCallback, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import partial from 'lodash/partial'
import DraggableComponent from './DraggableComponent'
import { DraggableEventHandler } from 'react-draggable'
import NodeBody from './NodeBody'
import NodeHalo from './NodeHalo'
import NodeCircle from './NodeCircle'
import NodeImage from './NodeImage'
import NodeLabel from './NodeLabel'
import type { Node as NodeType } from '../graph/node'
import type { State } from '../util/defaultState'
import { getNodeUIState, NodeUIState } from '../util/NodeUIState'
import { createSvgIcon } from '@mui/material'

type NodeProps = { id: string }

// This is our main node component
// <Node>
//   <DraggableComponent>
//     <NodeBody> (<g>, root in dom)
//       <NodeHalo>
//       <NodeLabel>
//       <NodeCircle>
//       <NodeImage>
export default function Node({ id }: NodeProps) {
  const dispatch = useDispatch()
  const editMode = useSelector<State, boolean>(state => Boolean(state.display.modes.editor))
  const node = useSelector<State, NodeType>(state => state.graph.nodes[id])
  const uiState = useSelector<State, NodeUIState>(partial(getNodeUIState, id))
  const draggedNode = useSelector<State>(state => state.display.draggedNode)
  // disable if not in edit mode or if another node is being dragged
  const disabled = !editMode || Boolean(editMode && draggedNode && draggedNode !== id)

  // const defaultPosition = {x: node.x, y: node.y }

  // reference to outermost <g> for node
  const nodeRef = useRef(null)

  const onStart = () => {
    dispatch({ type: 'DRAG_NODE_START', id })
  }

  const onStop: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: 'DRAG_NODE_STOP', id, deltas })
  }

  const onDrag: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: 'DRAG_NODE', id, deltas })
  }

  const onClickDraggable: DraggableEventHandler = (event) => {
    dispatch({ type: 'CLICK_NODE', id, shiftKey: event.shiftKey })
  }

  const onMouseEnter = () => {
    dispatch({ type: 'MOUSE_ENTERED_NODE', id })
  }

  const onMouseLeave = () => {
    dispatch({ type: 'MOUSE_LEFT_NODE', id })
  }

  // defaultPosition={defaultPosition}
  return (
    <DraggableComponent
      nodeRef={nodeRef}
      disabled={disabled}
      handle=".draggable-node-handle"
      onStart={onStart}
      onStop={onStop}
      onDrag={onDrag}
      onClick={onClickDraggable}
    >
      <NodeBody nodeRef={nodeRef} nodeId={node.id} appearance={uiState.appearance} url={node.url} enableClick={!editMode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <NodeLabel node={node} uiState={uiState} />
        <NodeHalo node={node} uiState={uiState} />
        <NodeCircle node={node} uiState={uiState} />
        { node.image && <NodeImage node={node} uiState={uiState} /> }
      </NodeBody>
    </DraggableComponent>
  )

}
