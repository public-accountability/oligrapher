import React from 'react'
import { NODE_RADIUS, Node as NodeType } from '../graph/node'
import { NodeUIState } from '../util/NodeUIState'

export function NodeCircle({ node, uiState }: { node: NodeType, uiState: NodeUIState }) {
  const { x, y, color, scale } = node
  const radius = NODE_RADIUS * scale

  const opacity = {
    normal: "1",
    highlighted: "1",
    faded: "0.2"
  }[uiState.appearance]

  return (
    <circle className="node-circle draggable-node-handle"
      cx={x}
      cy={y}
      r={radius}
      fill={color}
      opacity={opacity}
      onDragStart={(e) => e.preventDefault()} // to prevent HTML5 drag-n-drop (draggable="false" used to work)
      />
  )
}

export default React.memo(NodeCircle)
