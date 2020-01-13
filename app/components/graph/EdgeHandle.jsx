import React from 'react'
import PropTypes from 'prop-types'

const EXTRA_WIDTH = 20

export default function EdgeHandle(props) {
  return <path className="edge-handle"
               d={props.curve}
               width={props.width + EXTRA_WIDTH}
               onClick={props.onClick} >
         </path>
}

EdgeHandle.propTypes = {
  curve:   PropTypes.string.isRequired,
  width:   PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}
