import React from 'react'
import PropTypes from 'prop-types'


export default function Caption({text, x, y}) {
  return <g className="caption">
           <text x={x} y={y}>
             {text}
           </text>
         </g>
}

Caption.propTypes = {
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}
