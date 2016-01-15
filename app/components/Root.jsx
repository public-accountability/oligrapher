import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
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
         setNodeResults, setTitle,
         loadAnnotations, showAnnotation, createAnnotation,
         toggleAnnotations, updateAnnotation,
         deleteAnnotation, moveAnnotation,
         toggleHelpScreen, setSettings, toggleSettings } from '../actions';
import Graph from './Graph';
import Editor from './Editor';
import GraphHeader from './GraphHeader';
import GraphAnnotations from './GraphAnnotations';
import EditButton from './EditButton';
import HelpButton from './HelpButton';
import HelpScreen from './HelpScreen';
import SettingsButton from './SettingsButton';
import GraphSettingsForm from './GraphSettingsForm';
import SaveButton from './SaveButton';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import pick from 'lodash/object/pick';
import merge from 'lodash/object/merge';
import cloneDeep from 'lodash/lang/cloneDeep';
import isNumber from 'lodash/lang/isNumber';
import keys from 'lodash/object/keys';
import filter from 'lodash/collection/filter';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { shiftKey: false };
  }

  render() {
    let { dispatch, graph, selection, isEditor, isLocked, graphTitle,
          showEditTools, showSaveButton, showHelpScreen, 
          hasSettings, graphSettings, showSettings, onSave,
          currentIndex, annotation, annotations, showAnnotations } = this.props;
    let that = this;

    // apply annotation highlights to graph if available
    let annotatedGraph = graph && annotation ? GraphModel.setHighlights(graph, annotation, !isEditor) : graph;

    const keyMap = { 
      'undo': 'ctrl+,',
      'redo': 'ctrl+.',
      'zoomIn': 'ctrl+=',
      'zoomOut': 'ctrl+-',
      'resetZoom': 'ctrl+0',
      'shiftDown': { sequence: 'shift', action: 'keydown' },
      'shiftUp': { sequence: 'shift', action: 'keyup' },
      'delete': ['alt+d', 'ctrl+d', 'command+d']
    };

    const keyHandlers = {
      'undo': () => { dispatch(ActionCreators.undo()) },
      'redo': () => { dispatch(ActionCreators.redo()) },
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut()),
      'resetZoom': () => dispatch(resetZoom()),
      'shiftDown': () => this.setState({ shiftKey: true }),
      'shiftUp': () => this.setState({ shiftKey: false }),
      'delete': () => dispatch(deleteSelection(graph.id, selection))
    };

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

    let clickNode = (graphId, nodeId) => { 
      isEditor && showEditTools ? 
      dispatch(swapNodeSelection(nodeId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapNodeHighlight(graphId, nodeId))) 
    }
    let clickEdge = (graphId, edgeId) => { 
      isEditor && showEditTools ? 
      dispatch(swapEdgeSelection(edgeId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapEdgeHighlight(graphId, edgeId)))
    }
    let clickCaption = (graphId, captionId) => { 
      isEditor && showEditTools ? 
      dispatch(swapCaptionSelection(captionId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapCaptionHighlight(graphId, captionId)))
    }

    // annotations stuff

    let prevIndex = this.prevIndex();
    let nextIndex = this.nextIndex();

    let prevClick = () => dispatch(showAnnotation(prevIndex));
    let nextClick = () => dispatch(showAnnotation(nextIndex));
    let update = (index, data) => dispatch(updateAnnotation(index, data));
    let remove = (index) => dispatch(deleteAnnotation(index));
    let show = (index) => dispatch(showAnnotation(index));
    let create = () => { 
      dispatch(createAnnotation(this.props.annotations.length)); 
    };
    let move = (from, to) => dispatch(moveAnnotation(from, to));
    let swapAnnotations = (value) => dispatch(toggleAnnotations(value));
    let updateTitle = (title) => dispatch(setTitle(title));
    let updateSettings = (settings) => dispatch(setSettings(settings));

    let hasAnnotations = this.props.numAnnotations > 0;

    return (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <div className="row">
            <div id="oligrapherGraphCol" className={showAnnotations && hasAnnotations ? "col-md-8" : "col-md-12"}>
              { isEditor || graphTitle ? 
                <GraphHeader
                  {...this.props}
                  updateTitle={updateTitle}
                  title={graphTitle}
                  isEditor={isEditor} /> : null }

              <div id="oligrapherGraphContainer">
                { graph ? <Graph 
                  ref={(c) => { this.graph = c; if (c) { c.root = this; } }}
                  {...this.props}
                  graph={annotatedGraph ? annotatedGraph : graph}
                  isEditor={isEditor}
                  isLocked={isLocked}
                  clickNode={clickNode}
                  clickEdge={clickEdge}
                  clickCaption={clickCaption}
                  moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
                  moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
                  moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} /> : null }

                { graph ? <Editor 
                  {...this.props}
                  graphApi={graphApi}
                  isEditor={isEditor} 
                  showEditButton={false} 
                  hideHelp={true} 
                  setNodeResults={(nodes) => dispatch(setNodeResults(nodes))}
                  toggleAddForm={(form) => dispatch(toggleAddForm(form))}
                  undo={() => dispatch(ActionCreators.undo())}
                  redo={() => dispatch(ActionCreators.redo())} /> : null }

                <div id="oligrapherMetaButtons">
                  { isEditor ? 
                    <EditButton toggle={() => this.toggleEditTools()} showEditTools={showEditTools} /> : null }
                  { isEditor && hasSettings ? 
                    <SettingsButton toggleSettings={(value) => dispatch(toggleSettings(value))} /> : null }
                  { isEditor ? 
                    <HelpButton toggleHelpScreen={() => dispatch(toggleHelpScreen())} /> : null }
                </div>

                { showSettings && hasSettings ? <GraphSettingsForm settings={graphSettings} updateSettings={updateSettings} /> : null }
              </div>
            </div>
            { showAnnotations && hasAnnotations ?
              <GraphAnnotations 
                isEditor={isEditor}
                navList={isEditor}
                prevClick={prevClick}
                nextClick={nextClick}
                swapAnnotations={swapAnnotations}
                annotation={annotation}
                annotations={annotations}
                currentIndex={currentIndex}
                show={show}
                create={create}
                update={update}
                move={move}
                remove={remove}
                editForm={true}
                hideEditTools={() => dispatch(toggleEditTools(false))} /> : null }
          </div>
          { !showAnnotations && hasAnnotations ? 
            <div id="oligrapherShowAnnotations">
              <button onClick={() => swapAnnotations()} className="btn btn-lg btn-default">
                <span className="glyphicon glyphicon-font"></span>
              </button>
            </div> : null }          
          { showSaveButton && isEditor && onSave ? <SaveButton save={() => this.handleSave()} /> : null }
          { showHelpScreen ? <HelpScreen source={this.props.dataSource} close={() => dispatch(toggleHelpScreen(false))} /> : null }
        </HotKeys>
      </div>
    );
  }

  componentDidMount() {
    let { dispatch, title, graph, graphData, annotationsData, startIndex, settings, onSave } = this.props;

    if (graphData) {
      // data provided from outside
      this.loadData(graphData);
    } else if (!graph) {
      // load empty graph
      this.loadData(GraphModel.defaults());
    }

    if (title) {
      dispatch(setTitle(title));
    }

    if (annotationsData) {
      dispatch(loadAnnotations(annotationsData));
    }

    startIndex = (annotationsData[startIndex] ? startIndex : 0);

    if (startIndex) {
      dispatch(showAnnotation(startIndex));
    }

    if (settings) {
      dispatch(setSettings(settings));
    }
  }

  componentDidUpdate(prevProps) {
    let { selection, graph, onSelection } = this.props;

    if (JSON.stringify(prevProps.selection) !== JSON.stringify(selection)) {
      // fire selection callback with glorified selection state if selection changed
      if (onSelection) {
        onSelection(selection);
      }
    }

    if (JSON.stringify(prevProps.graph) !== JSON.stringify(this.props.graph)) {
      // this.updateAnnotationHighlights();

      // fire update callback if graph changed
      if (this.props.onUpdate) {      
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

  toggleEditTools(value)  { 
    this.props.dispatch(toggleEditTools(value));
  };


  prevIndex() {
    let { currentIndex, numAnnotations } = this.props;
    return currentIndex - 1 < 0 ? null : currentIndex - 1;
  }

  nextIndex() {
    let { currentIndex, numAnnotations } = this.props;
    return currentIndex + 1 > numAnnotations - 1 ? null : currentIndex + 1;
  }

  visibleAnnotations() {
    return this.props.showAnnotations && this.props.numAnnotations > 0;
  }

  graphWithoutHighlights() {
    return pick(
      GraphModel.clearHighlights(this.props.graph),
      ['nodes', 'edges', 'captions']
    );
  }

  updateAnnotationHighlights() {
    let highlights = GraphModel.highlightedOnly(this.props.graph);
    let updateData = { 
      nodeIds: keys(highlights.nodes), 
      edgeIds: keys(highlights.edges), 
      captionIds: keys(highlights.captions) 
    }
    this.props.dispatch(updateAnnotation(this.props.currentIndex, updateData));    
  }

  handleSave() {
    if (this.props.onSave) {
      this.props.onSave({
        title: this.props.graphTitle,
        graph: this.graphWithoutHighlights(),
        annotations: this.props.annotations,
        settings: this.props.graphSettings
      });
    }
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
    nodeResults: state.editTools.nodeResults,
    graphTitle: state.title,
    currentIndex: state.annotations.currentIndex,
    numAnnotations: state.annotations.list.length,
    annotation: state.annotations.list[state.annotations.currentIndex],
    annotations: state.annotations.list,
    showAnnotations: state.annotations.visible,
    graphSettings: state.settings,
    hasSettings: Object.keys(state.settings).length > 0,
    showHelpScreen: state.showHelpScreen,
    showSettings: state.showSettings
  };
}

export default connect(select, null, null, { withRef: true })(Root);