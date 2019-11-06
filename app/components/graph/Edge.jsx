import React from 'react'
import PropTypes from 'prop-types'
import EdgeLine from './EdgeLine'

import { svgParams as getSvgParams } from '../../graph/edge'

export default function Edge(props) {
  const edgeDomId = `edge-${props.edge.id}`
  const svgParams = getSvgParams(props.edge)

  return <g className="edge-group" id={edgeDomId}>
           <EdgeLine svgParams={svgParams} scale={props.edge.display.scale} />
         </g>
}

Edge.propTypes = {
  edge: PropTypes.object.isRequired
}
