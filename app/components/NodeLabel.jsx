import React from 'react'
import PropTypes from 'prop-types'

import textLines from '../util/textLines'
import { NODE_RADIUS } from '../graph/node'

const FONT_SIZE = 16

export default function NodeLabel({ node, perLineMax }) {
  const { name, x, y, scale } = node

  // we use a cube root so that font size and line height 
  // don't grow too much as node scale increases
  const scalePower = scale > 1 ? 1/3 : 1
  const fontSize = FONT_SIZE * Math.pow(scale, scalePower)
  const lineHeight = fontSize * 1.25
  const radius = NODE_RADIUS * scale

  const lines = textLines(name, perLineMax).map((line, i) => (
    <text
      key={i}
      x={x}
      y={radius + y + lineHeight}
      dy={i * lineHeight}
      textAnchor="middle"
      fontSize={fontSize + 'px'}
    >
      {line}
    </text>
  ))

  return node.url ? (
    <a className="node-label" href={node.url} target="_blank" rel="noopener noreferrer">
      { lines }
    </a> 
  ) : (
    <g className="node-label">
      {lines}
    </g>
  )
}

NodeLabel.propTypes = {
  node: PropTypes.object.isRequired,
  perLineMax: PropTypes.number
}
