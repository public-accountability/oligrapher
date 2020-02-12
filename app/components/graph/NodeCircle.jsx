import React from 'react'
import PropTypes from 'prop-types'



export function NodeCircle(props) {
  return <circle className="node-circle"
                 cx={props.x}
                 cy={props.y}
                 r={props.radius}
                 fill={props.color} />
}

NodeCircle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export default React.memo(NodeCircle)
