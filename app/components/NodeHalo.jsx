import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

const HALO_WIDTH = 6

export function NodeHalo({ node, selected, highlighted }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale
  const fill = selected ? "#50a3ff" : ( highlighted ? "#ffff00" : "none" )

  return (
    <circle
      className="node-halo-circle"
      cx={x}
      cy={y}
      r={radius + HALO_WIDTH}
      fill={fill} />
  )
}

NodeHalo.propTypes = {
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool
}

export default React.memo(NodeHalo)