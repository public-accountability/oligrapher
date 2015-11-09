import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, 
         zoomIn, zoomOut, resetZoom, 
         moveNode, moveEdge, moveCaption,
         swapNodeHighlight, swapEdgeHighlight } from '../actions';
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
    const singleSelect = !!this.props.isEditor;

    return this.props.graph ? (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <Graph 
            ref="graph"
            graph={this.props.graph} 
            zoom={this.props.zoom} 
            height={this.props.height}
            resetZoom={() => dispatch(resetZoom())} 
            clickNode={() => null}
            moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
            moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
            moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} 
            highlightNode={(graphId, nodeId) => this.props.isEditor ? dispatch(swapNodeHighlight(graphId, nodeId, singleSelect)): null}
            highlightEdge={(graphId, edgeId) => this.props.isEditor ? dispatch(swapEdgeHighlight(graphId, edgeId, singleSelect)): null} />
        </HotKeys>
      </div>
    ) : (<div></div>);
  }

  componentDidMount() {
    if (this.props.data) {
      this.loadData(this.props.data);
    }
  }

  loadData(data) {
    // showGraph needs a graph id so it's set here
    let graph = GraphModel.setDefaults(data);
    this.props.dispatch(loadGraph(graph));
    this.props.dispatch(showGraph(graph.id));
  }
}

function select(state) {
  return {
    graph: state.graphs[state.position.currentId],
    loadedId: state.position.loadedId,
    zoom: state.zoom
  };
}

export default connect(select, null, null, { withRef: true })(Root);