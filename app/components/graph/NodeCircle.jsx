import React from 'react'
import PropTypes from 'prop-types'
import Node from '../../models/Node'

export default function NodeCircle({node}) {
  return <g className="node-circle-group">
           <circle {...node.circle} className="node-circle" />
         </g>
}

NodeCircle.propTypes = {
  node: PropTypes.instanceOf(Node).isRequired
}
