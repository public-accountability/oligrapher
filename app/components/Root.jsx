import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadGraph, showGraph, 
         zoomIn, zoomOut, resetZoom, 
         moveNode, moveEdge, moveCaption,
         swapNodeHighlight, swapEdgeHighlight, swapCaptionHighlight,
         swapNodeSelection, swapEdgeSelection, swapCaptionSelection,
         deleteSelection, deselectAll,
         pruneGraph, layoutCircle, 
         addNode, addEdge, addCaption,
         updateNode, updateEdge, updateCaption,
         deleteAll, addSurroundingNodes,
         toggleEditTools, toggleAddForm,
         setNodeResults } from '../actions';
import Graph from './Graph';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import ReactDOM from 'react-dom';
import pick from 'lodash/object/pick';
import Editor from './Editor';
import { ActionCreators } from 'redux-undo';

class Root extends Component {

  render() {
    const keyMap = { 
      'undo': 'ctrl+,',
      'redo': 'ctrl+.',
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
      'undo': () => { console.log("undo"); dispatch(ActionCreators.undo()) },
      'redo': () => { console.log("redo"); dispatch(ActionCreators.redo()) },
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut()),
      'resetZoom': () => dispatch(resetZoom()),
      'shiftDown': () => this.setState({ shiftKey: true }),
      'shiftUp': () => this.setState({ shiftKey: false }),
      'altDown': () => this.setState({ altKey: true }),
      'altUp': () => this.setState({ altKey: false }),
      'delSelected': () => dispatch(deleteSelection(this.props.graph.id, this.props.selection))
    };

    const { dispatch, graph, isEditor, isLocked } = this.props;
    const that = this;

    let graphApi = {
      getGraph: () => this.props.graph,
      zoomIn: () => dispatch(zoomIn()),
      zoomOut: () => dispatch(zoomOut()),
      resetZoom: () => dispatch(resetZoom()),
      prune: () => dispatch(pruneGraph(graph.id)),
      circleLayout: () => dispatch(layoutCircle(graph.id)),
      addNode: (node) => dispatch(addNode(graph.id, node)),
      addEdge: (edge) => dispatch(addEdge(graph.id, edge)),
      addCaption: (caption) => dispatch(addCaption(graph.id, caption)),
      updateNode: (nodeId, data) => dispatch(updateNode(graph.id, nodeId, data)),
      updateEdge: (edgeId, data) => dispatch(updateEdge(graph.id, edgeId, data)),
      updateCaption: (captionId, data) => dispatch(updateCaption(graph.id, captionId, data)),
      deselectAll: () => dispatch(deselectAll(graph.id)),
      deleteAll: () => dispatch(deleteAll(graph.id)),
      addSurroundingNodes: (centerId, nodes) => dispatch(addSurroundingNodes(graph.id, centerId, nodes))
    };

    let _toggleEditTools = (value) => { dispatch(toggleEditTools(value)) };

    return (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          { this.props.graph ? <Graph 
            ref={(c) => { this.graph = c; if (c) { c.root = this; } }}
            graph={this.props.graph}
            zoom={this.props.zoom} 
            height={this.props.height}
            isEditor={isEditor}
            isLocked={isLocked}
            viewOnlyHighlighted={this.props.viewOnlyHighlighted}
            selection={this.props.selection}
            resetZoom={() => dispatch(resetZoom())} 
            moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
            moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
            moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} 
            clickNode={(graphId, nodeId) => { 
              isEditor ? 
              dispatch(swapNodeSelection(nodeId, !that.state.shiftKey)) : 
              (isLocked ? null : dispatch(swapNodeHighlight(graphId, nodeId))) 
            }}
            clickEdge={(graphId, edgeId) => { 
              isEditor ? 
              dispatch(swapEdgeSelection(edgeId, !that.state.shiftKey)) : 
              (isLocked ? null : dispatch(swapEdgeHighlight(graphId, edgeId)))
            }}
            clickCaption={(graphId, captionId) => { 
              isEditor ? 
              dispatch(swapCaptionSelection(captionId, !that.state.shiftKey)) : 
              (isLocked ? null : dispatch(swapCaptionHighlight(graphId, captionId)))
            }} /> : null }
          { this.props.graph ? <Editor 
            graph={this.props.graph}
            graphApi={graphApi}
            isEditor={isEditor} 
            showEditTools={this.props.showEditTools} 
            showEditButton={true} 
            hideHelp={true} 
            dataSource={this.props.dataSource} 
            selection={this.props.selection} 
            nodeResults={this.props.nodeResults}
            setNodeResults={(nodes) => dispatch(setNodeResults(nodes))}
            addForm={this.props.addForm}
            toggleEditTools={_toggleEditTools}
            toggleAddForm={(form) => dispatch(toggleAddForm(form))}
            undo={() => dispatch(ActionCreators.undo())}
            redo={() => dispatch(ActionCreators.redo())} 
            canUndo={(this.props.canUndo)}
            canRedo={this.props.canRedo} /> : null }
        </HotKeys>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.data) {
      // data provided from outside
      this.loadData(this.props.data);
    } else if (!this.props.graph) {
      // load empty graph
      this.loadData(GraphModel.defaults());
    }
  }

  componentDidUpdate(prevProps) {
    // fire selection callback with glorified selection state if selection changed
    if (this.props.onSelection) {
      let { selection, graph } = this.props;

      if (JSON.stringify(prevProps.selection) !== JSON.stringify(selection)) {
        this.props.onSelection(selection);
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

  toggleEditor(value) {
    this.setState({ isEditor: value });
    this.props.dispatch(deselectAll(this.props.graph.id));
  }

  toggleLocked(value) {
    this.setState({ isLocked: value });
  }
}

function select(state) {
  return {
    graph: state.graphs.present[state.position.currentId],
    canUndo: state.graphs.past.length > 0,
    canRedo: state.graphs.future.length > 0,
    loadedId: state.position.loadedId,
    selection: state.selection,
    zoom: state.zoom,
    showEditTools: state.editTools.visible,
    addForm: state.editTools.addForm,
    nodeResults: state.editTools.nodeResults
  };
}

export default connect(select, null, null, { withRef: true })(Root);