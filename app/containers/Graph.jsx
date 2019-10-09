import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Svg from '../components/graph/Svg'
import GraphModel from '../models/Graph'

const renderNode = function(node) {
  return <circle r="50" cx={node.x} cy={node.y} />
}


export class Graph extends Component {
  static propTypes = {
    graph: PropTypes.instanceOf(GraphModel).isRequired,
    svgAttributes: PropTypes.object.isRequired
  }

  render() {
    return <div id="oligrapher-graph">
             <Svg {...this.props.svgAttributes}>
               { Object.values(this.props.graph.nodes).map(renderNode) }
             </Svg>
           </div>
  }
}


// "outerDivSize": [ state.settings.rootElement.width,
//                       state.settings.rootElement.height],

const mapStateToProps = function(state) {
  let divSize = [400, 600]
  // console.log(state.graph)
  return {
    "graph": state.graph,
    "svgAttributes": {
      viewPortWidth: divSize[0],
      viewPortHeight: divSize[1],
      viewBoxMinX: state.graph.center[0],
      viewBoxMinY: state.graph.center[1],
      viewBoxWidth: divSize[0],
      viewBoxHeight: divSize[1],
      outermost: true
    }
  }

}

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
