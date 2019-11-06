import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Draggable, { DraggableCore } from 'react-draggable'
import NodeCircle from './NodeCircle'
import pick from 'lodash/pick'
import curry from 'lodash/curry'


export default function Node(props) {
  const nodeDomId = "node-" + props.node.id

  return <g id={nodeDomId} className="oligrapher-node">
           <NodeCircle node={props.node} />
         </g>
}


Node.propTypes = {
  node: PropTypes.object.isRequired
}

//2 { moveEdgeNode, calculateDeltas } from '../../graph/edge'
// import Graph from '../../graph/graph'


// import LegacyNode from '../../../legacy-app/components/Node'

// export default function Node(props) {
//   return <LegacyNode
//            node={props.node}



//          />
// }


// keep initial position for comparison with drag position
//  function handleDragStart(e, data) {
//     e.preventDefault();
//    this._startDrag = data;
//    this._startPosition = {
//      x: this.state.x,
//      y: this.state.y
//    }
//   }

//   // while dragging node and its edges are updated only in state, not store
// function handleDrag(e, data) {
//     let n = this.props.node;
//     let { x, y } = calculateDeltas(data, this._startPosition, this._startDrag, this.graph.state.actualZoom);
//     this.setState({ x, y });

//     // update state of connecting edges
//     let edges = Graph.edgesConnectedToNode(this.props.graph, n.id);
//     edges.forEach(edge => {
//       let thisNodeNum = edge.node1_id == n.id ? 1 : 2
//       let newEdge = Graph.moveEdgeNode(edge, thisNodeNum, x, y)
//       this.graph.edges[edge.id].setState(newEdge.display);
//     });
//   }

//   // store updated once dragging is done
// function handleDragStop(e, data) {}
// function handleClick() {}

// export default class Node extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleDragStart = handleDragStart.bind(this)
//     this.handleDrag = handleDrag.bind(this)
//     this.handleDragStop = handleDragStop.bind(this)
//     this.handleClick = handleClick.bind(this)
//     this.state = props.node.display;
//     // this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop', '_handleClick');
//   }

//   render() {
//     const n = this.props.node;
//     const { x, y, name } = this.state;
//     const groupId = `node-${n.id}`;
//     const transform = `translate(${x}, ${y})`;

//     return (
//       <DraggableCore
//         handle=".handle"
//         onStart={this.handleDragStart}
//         onDrag={this.handleDrag}
//         onStop={this.handleDragStop} >
//         <g
//           id={groupId}
//           className="node"
//           transform={transform}
//           onClick={this.handleClick}>
//           <NodeCircle node={n} selected={this.props.selected} />
//         </g>
//       </DraggableCore>
//     );
//   }


// }


// // function calculateDeltas(draggableData, startPosition, startDrag, actualZoom) => {
// //   const deltaX = draggableData.deltaX  / zoom;
// //   const deltaY = draggableData.deltaY / zoom;


// //   let x = deltaX + startPosition.x;
// //   let y = deltaY + startPosition.y;
// //   return { x, y };
// // }

// // function calculateDeltas(start, delta, zoom) {

// //     x:

// //   }
// // }

// // export default function Node(props) {
// //   const startPosition = pick(props.node.display, ['x', 'y'])
// //   const [coords, setCoords] = useState(startPosition)
// //   const [startDrag, setStartDrag] = useState(null)

// //   console.log(props.edges)

// //   const onStart = (event, data) => {
// //     console.log(props.edges)
// //     setStartDrag(data)
// //   }

// //   const onDrag = (event, data) => {
// //     let { x, y } = calculateDeltas(data, startPosition, startDrag, props.zoom)
// //     setCoords({x, y})

// //     console.log('coords', coords)
// //     props.edges.forEach(function(edge) {
// //       let newEdge = moveEdgeNode(edge, props.node, coords)
// //       props.updateEdge(newEdge)
// //     })

// //     const onStop = (event, data) => {
// //       // if (this._dragging) {
// //       //   this.props.moveNode(this.props.node.id, this.state.x, this.state.y);
// //       // }
// //     }

// //   }


// //   const nodeDomId = "node-" + props.node.id



// //   return <Draggable scale={props.zoom}
// //                     onStart={onStart}
// //                     onDrag={onDrag}
// //                     onStop={onStop} >
// //            <g id={nodeDomId} className="oligrapher-node" onClick={onClick}>
// //              <NodeCircle node={props.node} />
// //            </g>
// //          </Draggable>
// // }


// // Node.propTypes = {
// //   node:         PropTypes.object.isRequired,
// //   edges:        PropTypes.array.isRequired,
// //   zoom:         PropTypes.number.isRequired,
// //   updateEdge:   PropTypes.func.isRequired
// // }



// // // this.setState({ startX: props.node.display.x, startY: props.node.display.y })
