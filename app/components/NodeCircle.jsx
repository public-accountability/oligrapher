import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

export function NodeCircle({ node, status }) {
  const { x, y, color, scale } = node
  const radius = NODE_RADIUS * scale
  
  const opacity = {
    normal: "1",
    highlighted: "1",
    faded: "0.2"
  }[status]

  return (
    <circle className="node-circle draggable-node-handle"
      onDragEnter={() => console.log("dragenter")}
      cx={x}
      cy={y}
      r={radius}
      fill={color}
      opacity={opacity}
      />
  )
}

NodeCircle.propTypes = {
  node: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}

export default React.memo(NodeCircle)
