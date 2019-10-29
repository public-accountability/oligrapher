import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import curry from 'lodash/curry'
import pick from 'lodash/pick'
import { connect } from 'react-redux'
import { edgesOf } from '../graph/graph'
import NodeCircle from '../components/graph/NodeCircle'

const translateFromData = draggableData => `translate(${draggableData.x}, ${draggableData.y})`

const getEdgeInDom = edge => document.getElementById(`edge-${edge.id}`)

// function onDrag(moveNode, event, draggableData)  {
//   let delta = pick(draggableData, ['x', 'y'])
//   moveNode(delta)
// }

export function Node(props) {
  let nodeDomId = "node-" + props.node.id
  return <Draggable onDrag={props.moveNode} >
           <g id={nodeDomId} className="oligrapher-node">
             <NodeCircle node={props.node} />
           </g>
         </Draggable>
}


Node.propTypes = {
  node:   PropTypes.object.isRequired,
  edges:  PropTypes.array.isRequired,
  moveNode: PropTypes.func.isRequired
}

const mapStateToProps = function(state, ownProps) {
  return {
    "node": state.graph.nodes[ownProps.nodeId],
    "edges": edgesOf(state.graph, ownProps.nodeId)
  }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    moveNode: (event, draggableData) => {
      let delta = pick(draggableData, ['x', 'y'])
      dispatch({ type: 'MOVE_NODE', id: ownProps.nodeId, delta: delta })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Node)
