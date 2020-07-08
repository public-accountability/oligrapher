import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

const HALO_WIDTH = 6

export function NodeHalo({ node, selected, highlighted }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale
  const className = "node-halo"
    + (selected ? " node-halo-selected" : "")
    + (highlighted ? " node-halo-highlighted" : "")

  return (
    <circle
      className={className}
      cx={x}
      cy={y}
      r={radius + HALO_WIDTH}
      fill="none"
      />
  )
}

NodeHalo.propTypes = {
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool
}

export default React.memo(NodeHalo)