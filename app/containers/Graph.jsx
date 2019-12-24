import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { SvgRefContext } from '../contexts'
import GraphContainer from '../components/graph/GraphContainer'
import Edges from './Edges'
import Nodes from './Nodes'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'

import { computeActualZoom } from '../util/dimensions'

/*
  The core component that displays the graph
*/
export class Graph extends React.Component {

  constructor(props) {
    super(props)
    this.svgRef = React.createRef()
  }

  componentDidMount() {
    const actualZoom = computeActualZoom(this.props.viewBox, this.svgRef.current)
    this.props.setActualZoom(actualZoom)
  }

  // TODO: Combine SvgRefContext.Provider & GraphContainer
  render() {
    return <SvgRefContext.Provider value={this.svgRef} >
             <GraphContainer viewBox={this.props.viewBox}>
               <Zoomable zoom={this.props.zoom}>
                 <Pannable zoom={this.props.zoom} actualZoom={this.props.actualZoom}>
                   <Nodes />
                   <Edges />
                 </Pannable>
               </Zoomable>
             </GraphContainer>
           </SvgRefContext.Provider>
  }
}

Graph.propTypes = {
  viewBox: PropTypes.object.isRequired,
  setActualZoom: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  actualZoom: PropTypes.number
}

const mapStateToProps = function(state) {
  return {
    viewBox: state.graph.viewBox,
    zoom: state.graph.zoom,
    actualZoom: state.graph.actualZoom
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    setActualZoom: (actualZoom) => dispatch({ type: 'SET_ACTUAL_ZOOM', actualZoom })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)


/*

|div
| _____
| | Svg
| |
| |
|
|

// <circle stroke="red" cx="200" cy="200" r="50px"></circle>

*/
