import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector } from '../util/helpers'
import DraggableComponent from './DraggableComponent'
import NodeHalo from './NodeHalo'
import NodeCircle from './NodeCircle'
import NodeImage from './NodeImage'
import NodeLabel from './NodeLabel'

export function Node({ id, currentlyEdited }) {
  const dispatch = useDispatch()
  const node = useSelector(state => state.graph.nodes[id])
  const { name } = node
  const [isDragging, setDragging] = useState(false)
  const showHalo = currentlyEdited || isDragging

  const moveNode = useCallback(deltas => {
    setDragging(false)
    dispatch({ type: 'MOVE_NODE', id, deltas })
  }, [dispatch, id])

  // the id in the payload, while otherwise redundant, allows redux-undo 
  // to group drag actions into a single action
  const dragNode = useCallback(deltas => {
    dispatch({ type: 'DRAG_NODE', id, node, deltas })
  }, [dispatch, id, node])

  const startDrag = useCallback(() => setDragging(true), [])
  const clickNode = useCallback(() => {
    setDragging(false)
    dispatch({ type: 'CLICK_NODE', id })
  }, [dispatch, id])
  const onMouseEnter = useCallback(() => dispatch({ type: 'MOUSE_ENTERED_NODE', name }), [dispatch, name])
  const onMouseLeave = useCallback(() => dispatch({ type: 'MOUSE_LEFT_NODE' }), [dispatch])

  return (
    <>
      <DraggableComponent
        handle=".draggable-node-handle"
        onStart={startDrag}
        onStop={moveNode}
        onClick={clickNode}
        onDrag={dragNode}>
        <g id={"node-" + id} className="oligrapher-node" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <NodeHalo node={node} showHalo={showHalo} />
          <NodeCircle node={node} />
          <NodeImage node={node} />
          <NodeLabel node={node} />
        </g>
      </DraggableComponent>
    </>
  )
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  currentlyEdited: PropTypes.bool.isRequired
}

export default React.memo(Node)