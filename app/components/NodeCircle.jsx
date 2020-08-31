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
      cx={x}
      cy={y}
      r={radius}
      fill={color}
      opacity={opacity}
      onDragStart={(e) => e.preventDefault()} // to prevent HTML5 drag-n-drop (draggable="false" used to work)
      />
  )
}

NodeCircle.propTypes = {
  node: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}

NodeCircle.defaultProps = {
  status: 'normal'
}

export default React.memo(NodeCircle)
