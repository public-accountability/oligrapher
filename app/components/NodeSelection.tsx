import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import DraggableComponent from './DraggableComponent'
import type { ControlPosition } from  'react-draggable'

type NodeSelectionProps = {
  children: React.ReactNode,
  nodeIds: string[]
}

export default function NodeSelection({ children, nodeIds } : NodeSelectionProps) {
  const dispatch = useDispatch()

  const moveNodes = useCallback( (deltas: ControlPosition) => {
    dispatch({ type: 'MOVE_NODES', nodeIds, deltas })
  }, [dispatch, nodeIds])

  // the id in the payload, while otherwise redundant, allows redux-undo
  // to group drag actions into a single action
  const dragNodes = useCallback( (deltas: ControlPosition) => {
    dispatch({ type: 'DRAG_NODES', nodeIds, deltas })
  }, [dispatch, nodeIds])

  return <DraggableComponent
           disabled={nodeIds.length < 2}
           handle=".selected-nodes"
           onStop={moveNodes}
           onDrag={dragNodes}>
           <g className="selected-nodes">
             {children}
           </g>
         </DraggableComponent>

}
