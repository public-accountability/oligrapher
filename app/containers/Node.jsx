import React, { useState, useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector } from '../util/helpers'
import DraggableComponent from '../components/graph/DraggableComponent'
import NodeHalo from '../components/graph/NodeHalo'
import NodeCircle from '../components/graph/NodeCircle'
import NodeImage from '../components/graph/NodeImage'
import NodeLabel from '../components/graph/NodeLabel'
import { NodeDraggingContext } from './Graph'

export function Node({ id, currentlyEdited }) {
  const dispatch = useDispatch()
  const node = useSelector(state => state.graph.nodes[id])
  const { scale } = node
  const radius = 25 * scale
  const [dragging, setDragging] = useState(false)
  const editorMode = useSelector(state => state.display.modes.editor)
  const showHalo = currentlyEdited || dragging

  const dragContext = useContext(NodeDraggingContext)

  const moveNode = useCallback(deltas => {
    dragContext.handleNodeMove(node, deltas)
    setDragging(false)
    // dispatch({ type: 'MOVE_NODE', id, deltas })
  }, [node, dragContext])

  const onDrag = useCallback(deltas => {
    dragContext.handleNodeDrag(node, deltas)
    // context.edges[edgeId].updateNodePosition(id, translatePoint(node, deltas))
    // setIntersectingNode(findIntersectingNodeFromDrag(nodes, node, deltas))
    // dispatch({ type: 'DRAG_NODE', id, deltas })
  }, [node, dragContext])

  const clickNode = useCallback(() => dispatch({ type: 'CLICK_NODE', id }), [dispatch, id])
  const onStart = useCallback(() => setDragging(true), [])

  return (
    <>
      <DraggableComponent
        disabled={!editorMode}
        handle=".draggable-node-handle"
        onStart={onStart}
        onStop={moveNode}
        onClick={clickNode}
        onDrag={onDrag}>
        <g id={"node-" + id} className="oligrapher-node">
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