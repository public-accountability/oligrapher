import React from 'react'
import PropTypes from 'prop-types'

export default function EdgeHighlight(props) {
  const width = 10 + (props.scale - 1) * 5

  return (
    <path
      className="edge-highlight"
      d={props.curve}
      strokeWidth={width}
      fill="none">
    </path>
  )
}

EdgeHighlight.propTypes = {
  curve: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired
}