import React from 'react'
import PropTypes from 'prop-types'
import { newGraph } from '../../graph/graph'
import { computeViewBox } from '../../util/dimensions'

import GraphContainer from './GraphContainer'
import Edges from './Edges'
import Nodes from './Nodes'
import Pannable from './Pannable'
import Zoomable from './Zoomable'

import curry from 'lodash/curry'
import produce from 'immer'

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
      viewBox: computeViewBox(props.graph, props.zoom),
      graph: props.graph
    }

    // this.zoomTranslate = [0, 0]
    // this.state = { x: 0, y: 0, viewBox, height };
  }


  render() {
    let graph = this.state.graph
    let zoom = this.props.zoom

    // let updateEdge = (edge) => {
    //   this.setState({
    //     graph: produce(graph, draft => {
    //       draft.edges[edge.id] = edge
    //     })
    //   })
    // }

    let edgesProps = { edges: graph.edges}
    let nodesProps = { graph, zoom }

    return <GraphContainer viewBox={this.state.viewBox} height={this.props.height}>
             <Zoomable zoom={zoom} >
               <Pannable zoom={zoom}>
                 <Edges {...edgesProps} />
                 <Nodes {...nodesProps} />
                 <Captions captions={graph.captions} />
               </Pannable>
             </Zoomable>
           </GraphContainer>
  }

  update(newGraph) {
    // this.setState({grpah: graph})
  }

}
