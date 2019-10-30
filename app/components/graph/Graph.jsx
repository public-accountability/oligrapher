import React from 'react'
import PropTypes from 'prop-types'
import { newGraph } from '../../graph/graph'
import { computeViewBox } from '../../util/dimensions'

import GraphContainer from './GraphContainer'
import Edges from './Edges'
import Nodes from './Nodes'
import Pannable from './Pannable'
import Zoomable from './Zoomable'

function Captions(props) { return <></> }

/*
  Renders the core graph visual (no controls)

  It calls `props.changed` with two arguments: oldGraph and currentGraph

  Update()

*/
export default class Graph extends React.Component {
  static propTypes = {
    changed: PropTypes.func.isRequired,
    graph: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    height: PropTypes.string.isRequired
  }

  static defaultProps = {
    changed: (oldGraph, currentGraph) => {},
    graph: newGraph(),
    zoom: 1,
    height: '500px'
  }

  constructor(props) {
    super(props)
    this.state = {
      viewBox: computeViewBox(props.graph, props.zoom)
    }
    // this.zoomTranslate = [0, 0]
    // this.state = { x: 0, y: 0, viewBox, height };
  }


  render() {
    return <GraphContainer viewBox={this.state.viewBox} height={this.props.height}>
             <Zoomable zoom={this.props.zoom} >
               <Pannable zoom={this.props.zoom}>
                 <Edges edges={this.props.graph.edges} zoom={this.props.zoom} />
                 <Nodes graph={this.props.graph} zoom={this.props.zoom}/>
                 <Captions captions={this.props.graph.captions} />
               </Pannable>
             </Zoomable>
           </GraphContainer>
  }

  update(newGraph) {
    // this.setState({grpah: graph})
  }

}
