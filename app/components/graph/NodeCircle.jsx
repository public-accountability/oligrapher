import React from 'react'
import PropTypes from 'prop-types'
import { circle } from '../../graph/node'


export default function NodeCircle({node}) {
  return <g className="node-circle-group">
           <circle {...circle(node)} className="node-circle" />
         </g>
}

NodeCircle.propTypes = {
  node: PropTypes.object.isRequired
}
