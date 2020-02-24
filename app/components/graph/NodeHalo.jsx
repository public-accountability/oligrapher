import React from 'react'
import PropTypes from 'prop-types'
import { nodeStatuses } from '../../graph/node'

const HALO_WIDTH = 4

function getHaloColor(status) {
  return '#b6e63e'
  // switch(status) {
  // case 'selected':
  //   return '#b6e63e'
  // default:
  //   return '#fff'
  // }
}

export function NodeHalo(props) {
  return <g className="node-halo">
           <circle cx={props.x}
                   cy={props.y}
                   r={props.radius + HALO_WIDTH}
                   fill={getHaloColor(props.status)} />
           <circle cx={props.x}
                   cy={props.y}
                   r={props.radius}
                   fill="#fff" />
         </g>
}

NodeHalo.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  status: PropTypes.oneOf(nodeStatuses).isRequired
}

export default React.memo(NodeHalo)
