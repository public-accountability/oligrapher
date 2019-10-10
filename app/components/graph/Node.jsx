import React from 'react'
import PropTypes from 'prop-types'
import NodeModel from '../../models/Node'
import NodeCircle from './NodeCircle'
import Draggable from 'react-draggable'


const renderNode = function(node) {
  return <NodeCircle node={node}/>
}

// const renderNode = function(node) {
//   if (node.type === 'circle') {
//     return <NodeCircle node={node} />
//   } else if (node.type === 'image') {
//     return <NodeImage node={node} />
//   } else if (node.type === 'triangle') {
//     return <NodeTriangle node={node} />
//   } else {
//     throw new Error(`Invalid node type: ${node.type}`)
//   }
// }

const handleDrag = (event, data) => {
  // console.log('event', event)
  // console.log('data', data)
}

export default class Node extends React.Component {
  static propTypes = {
    node: PropTypes.instanceOf(NodeModel).isRequired
  }

  render() {
    let nodeDomId = "node-" + this.props.node.id

    return <Draggable onDrag={handleDrag} >
             <g id={nodeDomId} className="oligrapher-node">
               { renderNode(this.props.node) }
             </g>
           </Draggable>
  }
}
