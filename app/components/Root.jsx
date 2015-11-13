import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, 
         zoomIn, zoomOut, resetZoom, 
         moveNode, moveEdge, moveCaption,
         swapNodeHighlight, swapEdgeHighlight,
         swapNodeSelection, swapEdgeSelection, swapCaptionSelection,
         deleteSelection } from '../actions';
import Graph from './Graph';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import ReactDOM from 'react-dom';
import { pick } from 'lodash';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { shiftKey: false, altKey: false, altShiftKey: false };
  }

  render() {
    const keyMap = { 
      'zoomIn': 'ctrl+=',
      'zoomOut': 'ctrl+-',
      'resetZoom': 'ctrl+0',
      'shiftDown': { sequence: 'shift', action: 'keydown' },
      'shiftUp': { sequence: 'shift', action: 'keyup' },
      'altDown': [
        { sequence: 'alt', action: 'keydown' }, 
        { sequence: 'ctrl', action: 'keydown' },
        { sequence: 'command', action: 'keydown' }
      ],
      'altUp': [
        { sequence: 'alt', action: 'keyup' }, 
        { sequence: 'ctrl', action: 'keyup' },
        { sequence: 'command', action: 'keyup' }
      ],
      'delSelected': ['alt+d', 'ctrl+d', 'command+d']
    };

    const keyHandlers = {
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut()),
      'resetZoom': () => dispatch(resetZoom()),
      'shiftDown': () => this.setState({ shiftKey: true }),
      'shiftUp': () => this.setState({ shiftKey: false }),
      'altDown': () => this.setState({ altKey: true }),
      'altUp': () => this.setState({ altKey: false }),
      'delSelected': () => dispatch(deleteSelection(this.props.graph.id, this.props.selection))
    };

    const { dispatch, isEditor } = this.props;
    const that = this;

    return this.props.graph ? (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <Graph 
            ref={(c) => { this.graph = c; if (c) { c.root = this; } }}
            graph={this.props.graph} 
            zoom={this.props.zoom} 
            height={this.props.height}
            selection={this.props.selection}
            resetZoom={() => dispatch(resetZoom())} 
            moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
            moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
            moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} 
            highlightNode={(graphId, nodeId) => !isEditor ? dispatch(swapNodeHighlight(graphId, nodeId)) : null}
            highlightEdge={(graphId, edgeId) => !isEditor ? dispatch(swapEdgeHighlight(graphId, edgeId)) : null} 
            selectNode={(nodeId) => isEditor ? dispatch(swapNodeSelection(nodeId, !that.state.shiftKey)) : null}
            selectEdge={(edgeId) => isEditor ? dispatch(swapEdgeSelection(edgeId, !that.state.shiftKey)) : null}
            selectCaption={(captionId) => isEditor ? dispatch(swapCaptionSelection(captionId, !that.state.shiftKey)) : null} />
        </HotKeys>
      </div>
    ) : (<div></div>);
  }

  componentDidMount() {
    if (this.props.data) {
      // data provided from outside
      this.loadData(this.props.data);
    } else {
      // load empty graph
      this.loadData(GraphModel.defaults());
    }
  }

  componentDidUpdate(prevProps) {
    // fire selection callback with glorified selection state if selection changed
    if (this.props.onSelection) {
      let { selection, graph } = this.props;

      if (JSON.stringify(prevProps.selection) !== JSON.stringify(selection)) {
        let data = {
          nodes: pick(graph.nodes, selection.nodeIds),
          edges: pick(graph.edges, selection.edgeIds),
          captions: pick(graph.captions, selection.captionIds)
        }

        this.props.onSelection(data);
      }
    }

    // fire update callback if graph changed
    if (this.props.onUpdate) {
      if (JSON.stringify(prevProps.graph) !== JSON.stringify(this.props.graph)) {
        this.props.onUpdate(this.props.graph);
      }
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
    selection: state.selection,
    zoom: state.zoom
  };
}

export default connect(select, null, null, { withRef: true })(Root);