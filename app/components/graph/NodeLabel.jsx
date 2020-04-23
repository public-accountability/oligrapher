import React from 'react'
import PropTypes from 'prop-types'

import ds from '../../NodeDisplaySettings'
import textLines from '../../util/textLines'

const SPACING = 20

export default function NodeLabel(props) {
  if (!props.name) { return <></> }

  const y = props.radius + props.y + SPACING
  const x = props.x
  const lineHeight = props.lineHeight || ds.lineHeight

  const lines = textLines(props.name).map((line, i) => (
    <text key={i} x={x} y={y} dy={i * lineHeight} textAnchor="middle" >
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
  name: PropTypes.string,
  radius: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  lineHeight: PropTypes.number
}
