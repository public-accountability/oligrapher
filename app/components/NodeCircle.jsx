import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

export function NodeCircle({ node }) {
  const { x, y, color, scale } = node
  const radius = NODE_RADIUS * scale

  return (
    <circle className="node-circle draggable-node-handle"
      onDragEnter={() => console.log("dragenter")}
      cx={x}
      cy={y}
      r={radius}
      fill={color} />
  )
}

NodeCircle.propTypes = {
  node: PropTypes.object.isRequired
}

export default React.memo(NodeCircle)
