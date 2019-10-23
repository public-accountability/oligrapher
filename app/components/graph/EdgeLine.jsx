import React from 'react'
import PropTypes from 'prop-types'

export default function EdgeLine({curve}) {
  const pathAttributes = {
    className: 'edge-path',
    d: curve,
    fill: 'none',
    stroke: 'black'
  }

  return <g className="edge-group">
           <path {...pathAttributes}></path>
         </g>

}

EdgeLine.propTypes = {
  curve: PropTypes.string.isRequired
}
