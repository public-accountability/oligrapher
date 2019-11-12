import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_RADIUS = 25

export function NodeCircle(props) {
  return <circle className="node-circle"
                 cx={props.x}
                 cy={props.y}
                 r={DEFAULT_RADIUS * props.scale}
                 fill={props.color} />
}

NodeCircle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export default React.memo(NodeCircle)
