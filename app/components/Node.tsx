import React, { useCallback } from 'react'
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

// This is our main node component
// <Node>
//   <DraggableComponent>
//     <NodeBody> (<g>, root in dom)
//       <NodeHalo>
//       <NodeLabel>
//       <NodeCircle>
//       <NodeImage>
export default function Node({ id }: { id: string }) {
  const dispatch = useDispatch()
  const editMode = useSelector<State, boolean>(state => Boolean(state.display.modes.editor))
  const node = useSelector<State, NodeType>(state => state.graph.nodes[id])
  const uiState = useSelector<State, NodeUIState>(partial(getNodeUIState, id))

  const onStart = () => {
    dispatch({ type: 'DRAG_NODE_STOP', id })
  }

  const onStop: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: 'DRAG_NODE_STOP', id, deltas })
  }

  const onDrag: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: 'DRAG_NODE', id, deltas })
  }

  const onClickDraggable: DraggableEventHandler = () => {
    dispatch({ type: 'CLICK_NODE', id })
  }

  const onMouseEnter = () => {
    dispatch({ type: 'MOUSE_ENTERED_NODE', id })
  }

  const onMouseLeave = () => {
    dispatch({ type: 'MOUSE_LEFT_NODE', id })
  }

  return (
    <DraggableComponent disabled={editMode} handle=".draggable-node-handle" onStart={onStart} onStop={onStop} onDrag={onDrag} onClick={onClickDraggable}>
      <NodeBody nodeId={node.id} appearance={uiState.appearance} url={node.url} enableClick={!editMode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <NodeLabel node={node} uiState={uiState} />
        <NodeHalo node={node} uiState={uiState} />
        <NodeCircle node={node} uiState={uiState} />
        { node.image && <NodeImage node={node} uiState={uiState} /> }
      </NodeBody>
    </DraggableComponent>
  )

}

// // the id in the payload, while otherwise redundant, allows redux-undo to group drag actions into a single action
  // to prevent HTML5 drag-n-drop (draggable="false" used to work)
  //const onDragStart = (e: DraggableEvent) => e.preventDefault()
  // <DraggableComponent handle=".draggable-node-handle" onStop={onStop} onClick={onClick} onDrag={onDrag}>
  // onDragLeave={onMouseLeave}
  // { node.description && <title>{node.description}</title>}
