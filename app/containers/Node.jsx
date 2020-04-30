import React, { useState, useCallback, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector } from '../util/helpers'
import DraggableComponent from '../components/graph/DraggableComponent'
import NodeHalo from '../components/graph/NodeHalo'
import NodeCircle from '../components/graph/NodeCircle'
import NodeImage from '../components/graph/NodeImage'
import NodeLabel from '../components/graph/NodeLabel'
import EdgeCreationMessage from "./EdgeCreationMessage"
import { findIntersectingNodeFromDrag } from '../graph/node'

export default function Node({ node, currentlyEdited }) {
  const dispatch = useDispatch()
  const { id, scale } = node
  const radius = 25 * scale
  const [intersectingNode, setIntersectingNode] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [draggedOver, setDraggedOver] = useState(false)
  const editorMode = useSelector(state => state.display.modes.editor)
  const { nodes } = useSelector(state => state.graph)
  const showHalo = currentlyEdited || draggedOver || dragging

  const moveNode = useCallback(deltas => {
    if (intersectingNode) {
      // return node to original position
      dispatch({ type: 'MOVE_NODE', id, deltas: { x: 0, y: 0 } })
      // add edge between this node and intersecting node
      dispatch({ type: 'ADD_EDGE' }, { node1_id: node.id, node2_id: intersectingNode.id })
      dispatch({ type: 'OPEN_EDITOR', id, editorType: 'edge' })
    } else {
      dispatch({ type: 'MOVE_NODE', id, deltas })
    }

    setIntersectingNode(null)
    setDragging(false)
  }, [dispatch, id, node, intersectingNode])

  const dragNode = useCallback(deltas => {
    dispatch({ type: 'DRAG_NODE', id, deltas })
    setIntersectingNode(findIntersectingNodeFromDrag(nodes, node, deltas))
  }, [dispatch, id, node, nodes])

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
        onDrag={dragNode}>
        <g id={"node-" + id} className="oligrapher-node">
          <NodeHalo node={node} radius={radius} showHalo={showHalo} />
          <NodeCircle node={node} radius={radius} />
          <NodeImage node={node} radius={radius} />
          <NodeLabel node={node} radius={radius} />
        </g>
      </DraggableComponent>
      { intersectingNode && 
        ReactDOM.createPortal(
          <EdgeCreationMessage nodes={[node, intersectingNode]} />,
          document.getElementById('oligrapher-graph-container')
        )
      }
    </>
  )
}

Node.propTypes = {
  node: PropTypes.object.isRequired,
  currentlyEdited: PropTypes.bool.isRequired
}