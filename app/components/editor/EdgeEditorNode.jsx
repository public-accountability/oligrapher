import React from 'react'
import PropTypes from 'prop-types'

import NodeCircle from '../graph/NodeCircle'
import NodeLabel from '../graph/NodeLabel'

export default function EdgeEditorNode({ name }) {
  return (
    <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" preserveAspectRatio="xMidYMid">
      <NodeCircle
        x={40}
        y={20}
        radius={18}
        color="#ccc" />
      <NodeLabel
        x={40}
        y={10}
        radius={18}
        lineHeight={10}
        name={name} />
    </svg>
  )
}

EdgeEditorNode.propTypes = {
  name: PropTypes.string.isRequired
}