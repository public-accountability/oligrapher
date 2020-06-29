import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

export function NodeBgCircle({ node }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale

  return (
    <circle className="node-bg-circle"
      cx={x}
      cy={y}
      r={radius}
      fill="#fff"
      />
  )
}

NodeBgCircle.propTypes = {
  node: PropTypes.object.isRequired
}

export default React.memo(NodeBgCircle)
