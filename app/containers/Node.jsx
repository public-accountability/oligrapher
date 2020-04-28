import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { useSelector } from '../util/helpers'
import DraggableComponent from '../components/graph/DraggableComponent'
import NodeHalo from '../components/graph/NodeHalo'
import NodeCircle from '../components/graph/NodeCircle'
import NodeImage from '../components/graph/NodeImage'
import NodeLabel from '../components/graph/NodeLabel'

export default function Node({ node, currentlyEdited }) {
  const { id, scale, image } = node
  const radius = 25 * scale

  const dispatch = useDispatch()
  const editorMode = useSelector(state => state.display.modes.editor)
  const isNewEdgeNode = useSelector(state => state.edgeCreation.nodes.includes(id))

  const showImage = Boolean(image)
  const showHalo = isNewEdgeNode || currentlyEdited

  const moveNode = deltas => dispatch({ type: 'MOVE_NODE', id, deltas })
  const dragNode = deltas => dispatch({ type: 'DRAG_NODE', id, deltas })
  const clickNode = () => dispatch({ type: 'CLICK_NODE', id })

  return (
    <DraggableComponent
      disabled={!editorMode}
      handle=".draggable-node-handle"
      onStop={moveNode}
      onClick={clickNode}
      onDrag={dragNode}>
      <g id={"node-" + id} className="oligrapher-node">
        <NodeHalo node={node} radius={radius} showHalo={showHalo} />
        <NodeCircle node={node} radius={radius} />
        { showImage && <NodeImage node={node} radius={radius} /> }
        <NodeLabel node={node} radius={radius} />
      </g>
    </DraggableComponent>
  )
}

Node.propTypes = {
  node: PropTypes.object.isRequired,
  currentlyEdited: PropTypes.bool.isRequired
}