import React from 'react'
import PropTypes from 'prop-types'

const HALO_WIDTH = 6

export function NodeHalo({ node, radius, showHalo }) {
  const { x, y } = node

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
  radius: PropTypes.number.isRequired,
  showHalo: PropTypes.bool
}

export default React.memo(NodeHalo)