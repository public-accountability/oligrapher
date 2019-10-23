import React from 'react'
import PropTypes from 'prop-types'
import EdgeLine from './EdgeLine'

export default function Edge({edge, curve}) {
  let edgeDomId = `edge-${edge.id}`

  return <g className="edge-group" id={edgeDomId}>
           <EdgeLine curve={curve} />
         </g>
}

Edge.propTypes = {
    edge: PropTypes.object.isRequired,
    curve: PropTypes.string.isRequired
}
