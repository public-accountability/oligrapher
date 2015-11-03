import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, zoomIn, zoomOut, resetZoom, moveNode, moveEdge } from '../actions';
import Graph from './Graph';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import ReactDOM from 'react-dom';

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
    const that = this;

    return this.props.graph ? (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <Graph 
            ref={(c) => this.graphInstance = c }
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

  componentDidMount() {
    if (this.props.data) {
      this.loadData(this.props.data);
    }

    this._setSVGHeight();
  }

  loadData(data) {
    // showGraph needs a graph id so it's set here
    let graph = GraphModel.setDefaults(data);
    this.props.dispatch(loadGraph(graph));
  }

  _setSVGHeight() {
    if (this.graphInstance) {
      let container = ReactDOM.findDOMNode(this).parentElement;
      let height = container.clientHeight; // - 120;
      ReactDOM.findDOMNode(this.graphInstance).setAttribute("height", height);
    }
  }
}

function select(state) {
  return {
    graph: state.graphs[state.position.currentId],
    prevGraph: state.graphs[state.position.prevId],
    loadedId: state.position.loadedId,
    zoom: state.zoom
  };
}

export default connect(select, null, null, { withRef: true })(Root);