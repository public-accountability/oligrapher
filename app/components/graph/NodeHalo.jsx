import React from 'react'
import PropTypes from 'prop-types'

const HALO_WIDTH = 6

export function NodeHalo(props) {
  return (
    <circle
      className="node-halo-circle"
      cx={props.x}
      cy={props.y}
      r={props.radius + HALO_WIDTH}
      fill={props.showHalo ? "#50a3ff" : "none" } />
  )
}

NodeHalo.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  showHalo: PropTypes.bool
}

export default React.memo(NodeHalo)
