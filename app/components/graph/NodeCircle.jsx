import React from 'react'
import PropTypes from 'prop-types'

export function NodeCircle({ node, radius }) {
  const { x, y, color } = node

  return (
    <circle className="node-circke draggable-node-handle"
      onDragEnter={() => console.log("dragenter")}
      cx={x}
      cy={y}
      r={radius}
      fill={color} />
  )
}

NodeCircle.propTypes = {
  node: PropTypes.object.isRequired,
  radius: PropTypes.number.isRequired
}

export default React.memo(NodeCircle)
