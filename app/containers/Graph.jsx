import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Svg from '../components/graph/Svg'
import Node from '../components/graph/Node'
import GraphModel from '../models/Graph'


const renderNodes = nodes => Object.values(nodes)
                                   .map(n => <Node key={n.id} node={n} />)

export class Graph extends Component {
  static propTypes = {
    graph: PropTypes.instanceOf(GraphModel).isRequired,
    svgAttributes: PropTypes.object.isRequired
  }

  render() {
    return <div id="oligrapher-graph">
             <Svg {...this.props.svgAttributes}>
               { renderNodes(this.props.graph.nodes) }
             </Svg>
           </div>
  }
}


// "outerDivSize": [ state.settings.rootElement.width,
//                       state.settings.rootElement.height],

const mapStateToProps = function(state) {
  let divSize = [400, 600]

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
