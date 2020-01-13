import React from 'react'
import PropTypes from 'prop-types'

const RADIUS = 8
//const TARGET = RADIUS * 2

export default function NodeHandle(props) {
  const onClick = (event) => {
    event.preventDefault()
    props.action()
  }


  return <circle className="node-handle"
                 cx={props.x}
                 cy={props.y}
                 r={RADIUS}
                 fill="blue"
                 onClick={onClick} />
}


NodeHandle.propTypes = {
  x:      PropTypes.number.isRequired,
  y:      PropTypes.number.isRequired,
  action: PropTypes.func.isRequired
}
