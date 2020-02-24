import React from 'react'
import PropTypes from 'prop-types'

const HALO_WIDTH = 4

export function NodeHalo(props) {
  return <g className="node-halo-group">
           <circle className="node-halo-circle"
                   cx={props.x}
                   cy={props.y}
                   r={props.radius + HALO_WIDTH} />
           <circle cx={props.x}
                   cy={props.y}
                   r={props.radius}
                   fill="#fff" />
         </g>
}

NodeHalo.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired
}

export default React.memo(NodeHalo)
