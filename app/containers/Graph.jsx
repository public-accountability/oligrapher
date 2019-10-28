import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Svg from '../components/graph/Svg'

import Nodes from './Nodes'
import Edges from './Edges'

import values from 'lodash/values'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'

// function SvgTest() {
//   let props = {
//     viewPortWidth: '100%',
//     viewPortHeight: '100%',
//     viewBoxMinX: 0,
//     viewBoxMinY: 0,
//     viewBoxWidth: 500,
//     viewBoxHeight: 500,
//     outermost: true
//   }

//   return  <Svg {...props}>
//             <circle stroke="red" cx="200" cy="200" r="50px">
//             </circle>
//           </Svg>
// }


const defaultViewBox = { minX: 0, minY: 0,  w: 600, h: 600 }
const padding = 100

function computeViewBox(nodes = [], zoom = 1) {
    if (nodes.length === 0) {
    return defaultViewBox
  }

  // Get the X and Y values of all the nodes
  const xValues = nodes.map(n => n.display.x)
  const yValues = nodes.map(n => n.display.y)
  // Calculate the maximum and minimum X/Y values
  const minNodeX = Math.min(...xValues)
  const minNodeY = Math.min(...yValues)
  const maxNodeX = Math.max(...xValues)
  const maxNodeY = Math.max(...yValues)

  // Subtract padding and calculate ViewBox
  const minX = minNodeX - padding
  const minY = minNodeY - padding
  const w = maxNodeX - minNodeX + (padding * 2)
  const h = maxNodeY - minNodeY + (padding * 2)

  const viewBox = { minX, minY, w, h }

  // We can return here if the zoom is 1
  if (zoom === 1) {
    return viewBox
  }

  // Update viewBox according to zoom settings
  const zoomW = w / zoom
  const zoomH = h / zoom
  const zoomMinX = minX + (w / 2) - (zoomW / 2)
  const zoomMinY = minY + (h / 2) - (zoomH / 2)

  return {
    minX: zoomMinX,
    minY: zoomMinY,
    w: zoomW,
    h: zoomH
  }
}

export class Graph extends Component {
  static propTypes = {
    nodes: PropTypes.object
  }


  render() {
    let nodesArray = values(this.props.nodes)
    let viewBox = computeViewBox(nodesArray)
    return <div id="oligrapher-graph">
             <Svg viewBox={viewBox} outermost={true}>
               <Nodes />
               <Edges />
             </Svg>
           </div>
  }
}


// "outerDivSize": [ state.settings.rootElement.width,
//                       state.settings.rootElement.height],

const mapStateToProps = function(state) {
  return {
    nodes: state.graph.nodes
  }
}

// const mapDispatchToProps = function(dispatch) {
//   return {
//     moveNodeAction: (nodeId, delta) => {
//       dispatch({
//         type: 'MOVE_NODE',
//         id: nodeId,
//         delta: delta
//       })
//     }
//   }
// }

export default connect(mapStateToProps)(Graph)



/*


__________________
|div
| _____
| | Svg
| |
| |
|
|

// <circle stroke="red" cx="200" cy="200" r="50px"></circle>

*/
