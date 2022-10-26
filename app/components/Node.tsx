import React, { MouseEventHandler, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import DraggableComponent from "./DraggableComponent"
import { DraggableEventHandler } from "react-draggable"
import NodeBody from "./NodeBody"
import NodeHalo from "./NodeHalo"
import NodeCircle from "./NodeCircle"
import NodeImage from "./NodeImage"
import NodeLabel from "./NodeLabel"
import type { Node as NodeType } from "../graph/node"
import type { State } from "../util/defaultState"
import { getNodeUIState, NodeUIState } from "../util/NodeUIState"
import { editModeSelector } from "../util/selectors"

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
  const editMode = useSelector(editModeSelector)
  const node = useSelector<State, NodeType>(state => state.graph.nodes[id])
  const uiState = useSelector<State, NodeUIState>(state => getNodeUIState(id, state))

  // reference to outermost <g> for node
  const nodeRef = useRef(null)

  const onStop: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    if (editMode) {
      dispatch({ type: "MOVE_NODE_OR_ADD_EDGE_FROM_DRAG", id, deltas })
    }
  }
  const onDrag: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    const transform = nodeRef.current.getAttribute("transform")
    dispatch({ type: "DRAG_NODE", id, deltas, transform })
  }

  const onClick: DraggableEventHandler = (event, data) => {
    const deltas = { x: data.x, y: data.y }
    // dispatch({ type: 'MOVE_NODE', id, deltas })
    dispatch({ type: "CLICK_NODE", id, shiftKey: event.shiftKey, deltas })
  }

  const onMouseEnter = () => {
    dispatch({ type: "MOUSE_ENTERED_NODE", id })
  }
  const onMouseLeave = () => {
    dispatch({ type: "MOUSE_LEFT_NODE", id })
  }

  const onMouseMove: MouseEventHandler = event => {
    event.stopPropagation()
  }

  return (
    <DraggableComponent
      nodeId={id}
      nodeRef={nodeRef}
      disabled={uiState.disabled}
      handle=".draggable-node-handle"
      onStop={onStop}
      onDrag={onDrag}
      onClick={onClick}
    >
      <NodeBody
        ref={nodeRef}
        nodeId={node.id}
        ui={uiState}
        url={node.url}
        enableClick={!editMode}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        <NodeLabel node={node} uiState={uiState} />
        <NodeHalo node={node} uiState={uiState} />
        <NodeCircle node={node} uiState={uiState} />
        {node.image && <NodeImage node={node} uiState={uiState} />}
      </NodeBody>
    </DraggableComponent>
  )
}
