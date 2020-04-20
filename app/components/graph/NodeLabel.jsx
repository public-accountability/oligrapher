import React from 'react'
import PropTypes from 'prop-types'

import ds from '../../NodeDisplaySettings'
import textLines from '../../util/textLines'

const SPACING = 20

export default function NodeLabel(props) {
  if (!props.name) { return <></> }

  const y = props.radius + props.y + SPACING
  const x = props.x

  const lines = textLines(props.name).map(function(line, i) {
    const props = {
      x: x,
      y: y,
      dy: i === 0 ? 0 : (i * ds.lineHeight),
      textAnchor: "middle"
    }

    return (
      <text key={i} {...props} >
        {line}
      </text>
    )
  })

  return (
    <g className="nodelabel">
      {lines}
    </g>
  )
}

NodeLabel.propTypes = {
  name: PropTypes.string,
  radius: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  url: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}
