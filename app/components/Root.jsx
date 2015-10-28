import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, zoomIn, zoomOut, resetZoom, moveNode, moveEdge } from '../actions';
import Graph from './Graph';
import GraphZoomButtons from './GraphZoomButtons';

class Root extends Component {
  render() {
    const { dispatch } = this.props;
    return this.props.graph ? (
      <div id="graphContainer">
        <GraphZoomButtons zoomIn={() => dispatch(zoomIn())} zoomOut={() => dispatch(zoomOut())} />
        <Graph 
          ref={(g) => Oligrapher.graphInstance = g}
          graph={this.props.graph} 
          zoom={this.props.zoom} 
          prevGraph={this.props.prevGraph} 
          resetZoom={() => dispatch(resetZoom())} 
          clickNode={() => null}
          moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
          moveEdge={(graphId, edgeId, x, y, cx, cy) => dispatch(moveEdge(graphId, edgeId, x, y, cx, cy))} />
      </div>
    ) : (<div id="graphContainer"></div>);
  }

  componentDidMount(){
    const { dispatch, data } = this.props;

    if (data) {
      dispatch(loadGraph(data));
      dispatch(showGraph(data.id));
    }
  }
}

function select(state) {
  return {
    graph: state.graphs[state.position.currentId],
    prevGraph: state.graphs[state.position.prevId],
    zoom: state.zoom
  };
}

export default connect(select)(Root);