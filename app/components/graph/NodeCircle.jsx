import React from 'react'
import PropTypes from 'prop-types'

export function NodeCircle(props) {
  return (
    <circle className="node-circke draggable-node-handle"
      cx={props.x}
      cy={props.y}
      r={props.radius}
      fill={props.color} />
  )
}

NodeCircle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  useHandle: PropTypes.bool.isRequired
}

NodeCircle.defaultProps = {
  useHandle: true
}

export default React.memo(NodeCircle)
