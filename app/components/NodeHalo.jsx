import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

const HALO_WIDTH = 6

export function NodeHalo({ node, showHalo }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale

  return (
    <circle
      className="node-halo-circle"
      cx={x}
      cy={y}
      r={radius + HALO_WIDTH}
      fill={showHalo ? "#50a3ff" : "none" } />
  )
}

NodeHalo.propTypes = {
  node: PropTypes.object.isRequired,
  showHalo: PropTypes.bool
}

export default React.memo(NodeHalo)