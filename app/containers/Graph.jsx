import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Svg from '../components/graph/Svg'
import ZoomBox from '../components/graph/ZoomBox'

import Draggable from 'react-draggable'

import Nodes from './Nodes'
import Edges from './Edges'
import { computeViewBox } from '../graph/graph'

import values from 'lodash/values'



export class Graph extends Component {
  static propTypes = {
    nodes: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      viewBox: computeViewBox(values(props.nodes)),

    }
  }


  render() {
    return <div id="oligrapher-graph">
             <Svg viewBox={this.state.viewBox} outermost={true}>
               <ZoomBox>
                 <g id="oligrapher-outer-svg-group">
                   <Nodes />
                   <Edges />
                 </g>
               </ZoomBox>
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
