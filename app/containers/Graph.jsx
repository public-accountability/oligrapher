import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Svg from '../components/graph/Svg'
import Nodes from './Nodes'
import Edges from './Edges'

export class Graph extends Component {
  static propTypes = {
    svgAttributes: PropTypes.object.isRequired
  }

  render() {
    return <div id="oligrapher-graph">
             <Svg {...this.props.svgAttributes} >
               <Nodes />
               <Edges />
             </Svg>
           </div>
  }
}


// "outerDivSize": [ state.settings.rootElement.width,
//                       state.settings.rootElement.height],

const mapStateToProps = function(state) {
  let divSize = [400, 600]
   let center = state.graph.center

  return {
    "svgAttributes": {
      viewPortWidth: divSize[0],
      viewPortHeight: divSize[1],
      viewBoxMinX: center[0],
      viewBoxMinY: center[1],
      viewBoxWidth: divSize[0],
      viewBoxHeight: divSize[1],
      outermost: true
    }
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














*/
