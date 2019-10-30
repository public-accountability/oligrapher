import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import NodeCircle from './NodeCircle'

function clickNode(event) {
  console.log("You clicked on a node!")
}

export default function Node({node, zoom}) {
  let nodeDomId = "node-" + node.id

  return <Draggable scale={zoom}>
           <g id={nodeDomId} className="oligrapher-node"
              onClick={clickNode}>
             <NodeCircle node={node} />
           </g>
         </Draggable>
}


Node.propTypes = {
  node: PropTypes.object.isRequired,
  zoom: PropTypes.object.isRequired
}



// this.setState({ startX: props.node.display.x, startY: props.node.display.y })
