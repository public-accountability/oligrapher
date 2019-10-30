import React from 'react'
import PropTypes from 'prop-types'
import { newGraph } from '../../graph/graph'
import { computeViewBox } from '../../util/dimensions'

import GraphContainer from './GraphContainer'
import Edges from './Edges'

function ZoomBox(props) {
  return <>{props.children}</>
}

// function Edges(props) {
//   console.log(props.edges)
//   return <></>
// }

function Nodes(props) {
  console.log(props.nodes)
  return <></>
}

function Captions(props) {
  console.log(props.captions)
  return <></>
}

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
    // this.state = { x: 0, y: 0, viewBox, height };
  }


  render() {
    return <GraphContainer viewBox={this.state.viewBox} height={this.props.height}>
             <ZoomBox>
               <Edges edges={this.props.graph.edges} zoom={this.props.zoom} />
               <Nodes nodes={this.props.graph.nodes} />
               <Captions captions={this.props.graph.captions} />
               <h1>Graph</h1>
             </ZoomBox>
           </GraphContainer>
  }

  update(newGraph) {
    // this.setState({grpah: graph})
  }

}
