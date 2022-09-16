import React from 'react'

import { NODE_RADIUS } from '../graph/node'

const HALO_WIDTH = 6

export function NodeHalo({ node, uiState }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale

  const className = "node-halo"
    + (uiState.selected ? " node-halo-selected" : "")
    + (uiState.highlighted ? " node-halo-highlighted" : "")

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

export default React.memo(NodeHalo)
