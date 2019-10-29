import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { newGraph } from '../../graph/graph'

function GraphContainer(props) {
  return <>{props.children}</>
}

function ZoomBox(props) {
  return <>{props.children}</>
}

function Edges(props) {
  console.log(props.edges)
  return <></>
}

function Nodes(props) {
  console.log(props.nodes)
  return <></>
}

function Captions(props) {
  console.log(props.captions)
  return <></>
}

/*
  renders the core graph visual (no controls)

  It calls `props.changed` with two arguments: oldGraph and currentGraph

  Update()

*/
export default  class Graph extends Component {
  static propTypes = {
    changed: PropTypes.func.isRequired,
    graph: PropTypes.object
  }

  static defaultProps = {
    changed: (oldGraph, currentGraph) => {},
    graph: newGraph()
  }

  constructor(props) {
    super(props)
  }

  render() {
    return <GraphContainer>
             <ZoomBox>
               <Edges edges={this.props.graph.edges} />
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
