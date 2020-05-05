import React from 'react'
import PropTypes from 'prop-types'

import ds from '../NodeDisplaySettings'
import textLines from '../util/textLines'

const SPACING = 20

export default function NodeLabel({ node, radius, lineHeight }) {
  const { name, x, y } = node
  
  if (!name) { return <></> }

  const lines = textLines(name).map((line, i) => (
    <text key={i} x={x} y={radius + y + SPACING} dy={i * (lineHeight || ds.lineHeight)} textAnchor="middle" >
      {line}
    </text>
  ))

  return (
    <g className="node-label">
      {lines}
    </g>
  )
}

NodeLabel.propTypes = {
  node: PropTypes.object.isRequired,
  radius: PropTypes.number.isRequired,
  lineHeight: PropTypes.number
}
