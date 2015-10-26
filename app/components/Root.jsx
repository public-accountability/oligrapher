import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, zoomIn, zoomOut, resetZoom, moveNode } from '../actions';
import Graph from './Graph';
import GraphZoomButtons from './GraphZoomButtons';

class Root extends Component {
  render() {
    const { dispatch } = this.props;
    return this.props.graph ? (
      <div id="graphContainer">
        <GraphZoomButtons zoomIn={() => dispatch(zoomIn())} zoomOut={() => dispatch(zoomOut())} />
        <Graph 
          graph={this.props.graph} 
          zoom={this.props.zoom} 
          prevGraph={this.props.prevGraph} 
          resetZoom={() => dispatch(resetZoom())} 
          clickNode={() => null}
          moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} />
      </div>
    ) : (<div id="graphContainer"></div>);
  }

  componentDidMount(){
    if (this.props.data) {
      const { dispatch } = this.props;
      dispatch(loadGraph(this.props.data));
      dispatch(showGraph(this.props.data.id));
    }
  }
}

function select(state) {
  return {
    graph: state.graphs.find(graph => graph.id == state.position.currentId),
    prevGraph: state.graphs.find(graph => graph.id == state.position.prevId),
    zoom: state.zoom
  };
}

export default connect(select)(Root);