import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector } from '../util/helpers'
import DraggableComponent from '../components/graph/DraggableComponent'
import NodeHalo from '../components/graph/NodeHalo'
import NodeCircle from '../components/graph/NodeCircle'
import NodeImage from '../components/graph/NodeImage'
import NodeLabel from '../components/graph/NodeLabel'

export function Node({ id, currentlyEdited }) {
  const dispatch = useDispatch()
  const node = useSelector(state => state.graph.nodes[id])
  const { scale, name } = node
  const radius = 25 * scale
  const [isDragging, setDragging] = useState(false)
  const editorMode = useSelector(state => state.display.modes.editor)
  const showHalo = currentlyEdited || isDragging

  const moveNode = useCallback(deltas => {
    setDragging(false)
    dispatch({ type: 'MOVE_NODE', id, deltas })
  }, [dispatch, id])

  // the id in the payload, while otherwise redundant, allows redux-undo 
  // to group drag actions into a single action
  const onDrag = useCallback(deltas => {
    dispatch({ type: 'DRAG_NODE', id, node, deltas })
  }, [dispatch, id, node])

  const onStart = useCallback(() => setDragging(true), [])
  const clickNode = useCallback(() => {
    setDragging(false)
    dispatch({ type: 'CLICK_NODE', id })
  }, [dispatch, id])
  const onMouseEnter = useCallback(() => dispatch({ type: 'MOUSE_ENTERED_NODE', name }), [dispatch, name])
  const onMouseLeave = useCallback(() => dispatch({ type: 'MOUSE_LEFT_NODE' }), [dispatch])

  return (
    <>
      <DraggableComponent
        disabled={!editorMode}
        handle=".draggable-node-handle"
        onStart={onStart}
        onStop={moveNode}
        onClick={clickNode}
        onDrag={onDrag}>
        <g id={"node-" + id} className="oligrapher-node" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <NodeHalo node={node} radius={radius} showHalo={showHalo} />
          <NodeCircle node={node} radius={radius} />
          <NodeImage node={node} radius={radius} />
          <NodeLabel node={node} radius={radius} />
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