import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, zoomIn, zoomOut, resetZoom, moveNode, moveEdge } from '../actions';
import Graph from './Graph';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';

class Root extends Component {
  render() {
    const keyMap = { 
      'zoomIn': 'ctrl+=',
      'zoomOut': 'ctrl+-'
    };

    const keyHandlers = {
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut())
    };

    const { dispatch } = this.props;

    return this.props.graph ? (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <Graph 
            ref={(g) => Oligrapher.graphInstance = g}
            graph={this.props.graph} 
            zoom={this.props.zoom} 
            prevGraph={this.props.prevGraph} 
            resetZoom={() => dispatch(resetZoom())} 
            clickNode={() => null}
            moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
            moveEdge={(graphId, edgeId, x, y, cx, cy) => dispatch(moveEdge(graphId, edgeId, x, y, cx, cy))} />
        </HotKeys>
      </div>
    ) : (<div></div>);
  }

  componentDidMount(){
    const { dispatch, data } = this.props;

    if (data) {
      // showGraph needs a graph id so it's set here
      let graph = GraphModel.setDefaults(data);
      dispatch(loadGraph(graph));
      dispatch(showGraph(graph.id));
    }
  }

  zoomIn() {
    console.log("zoom in");
  }

  zoomOut() {
    console.log("zoom out");
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