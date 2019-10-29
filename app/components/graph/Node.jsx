import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import NodeCircle from './NodeCircle'

export default function Node({node}) {
  let nodeDomId = "node-" + node.id

  return <Draggable>
           <g id={nodeDomId} className="oligrapher-node">
             <NodeCircle node={node} />
           </g>
         </Draggable>
}


Node.propTypes = {
  node: PropTypes.object.isRequired
}



// this.setState({ startX: props.node.display.x, startY: props.node.display.y })
