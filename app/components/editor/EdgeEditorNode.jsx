import React from 'react'
import PropTypes from 'prop-types'

import NodeCircle from '../graph/NodeCircle'
import NodeLabel from '../graph/NodeLabel'

export default function EdgeEditorNode({ node }) {
  const nodeCopy = Object.assign({}, node, { x: 40, y: 20, radius: 18 })

  return (
    <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" preserveAspectRatio="xMidYMid">
      <NodeCircle node={nodeCopy} radius={18} />
      <NodeLabel node={nodeCopy} radius={18} lineHeight={10} />
    </svg>
  )
}

EdgeEditorNode.propTypes = {
  node: PropTypes.object.isRequired
}