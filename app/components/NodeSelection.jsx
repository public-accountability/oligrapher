import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import DraggableComponent from './DraggableComponent'

export default function NodeSelection({ children, nodeIds }) {
  const dispatch = useDispatch()

  const moveNodes = useCallback(deltas => {
    dispatch({ type: 'MOVE_NODES', nodeIds, deltas })
  }, [dispatch, nodeIds])

  // the id in the payload, while otherwise redundant, allows redux-undo 
  // to group drag actions into a single action
  const dragNodes = useCallback(deltas => {
    dispatch({ type: 'DRAG_NODES', nodeIds, deltas })
  }, [dispatch, nodeIds])

  return (
    <DraggableComponent
      disabled={nodeIds.length < 2}
      handle=".selected-nodes"
      onStop={moveNodes}
      onDrag={dragNodes}>
      <g className="selected-nodes">
        {children}
      </g>
    </DraggableComponent>
  )
}

NodeSelection.propTypes = {
  children: PropTypes.node.isRequired,
  nodeIds: PropTypes.array.isRequired
}