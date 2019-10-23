import React from 'react'
import PropTypes from 'prop-types'
import NodeModel from '../../models/Node'
import NodeCircle from './NodeCircle'
import Draggable, { DraggableCore } from 'react-draggable';

const noop = () => {}

import pick from 'lodash/pick'

const renderNode = function(node) {
  return <NodeCircle node={node} />
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

// const moveNode= function(nodeId, moveNodeAction) {
//   return function(_, data) {
//     console.log(data)
//     moveNodeAction(nodeId, )
//   }
// }


function onDrag() {}

function onStart() {}

function onEnd() {

}



export default class Node extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired
  }


  constructor(props) {
    super(props)
    this.setState({ startX: props.node.display.x, startY: props.node.display.y })
  }


  render() {
    let nodeDomId = "node-" + this.props.node.id
    // let handleMove = (event, data) => moveNodeAction(node.id, pick(data, ['x', 'y']))
    // let move2 = (event, data) => { console.log('move2'); moveNodeAction(node.id, {x: 2, y: 2}) }

    return <g id={nodeDomId} className="oligrapher-node">
             { renderNode(this.props.node) }
           </g>
  }
}
