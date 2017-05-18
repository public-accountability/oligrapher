import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
         fetchInterlocks,
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
import EmbeddedGraphAnnotations from './EmbeddedGraphAnnotations';
import EditButton from './EditButton';
import HelpButton from './HelpButton';
import HelpScreen from './HelpScreen';
import SettingsButton from './SettingsButton';
import GraphSettingsForm from './GraphSettingsForm';
import SaveButton from './SaveButton';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { legacyEdgesConverter } from '../helpers';

export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { shiftKey: false };
  }

  render() {
    let { dispatch, graph, selection, isEditor, isLocked, isEmbedded, embedded,
	  title, showEditTools, showSaveButton, showHelpScreen, 
          hasSettings, graphSettings, showSettings, onSave,
          currentIndex, annotation, annotations, visibleAnnotations } = this.props;
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
      'delete': ['alt+d', 'ctrl+d', 'command+d', 'del', 'backspace'],
      'left': 'left',
      'right': 'right'
    };

    const keyHandlers = {
      'undo': () => { dispatch(ActionCreators.undo()) },
      'redo': () => { dispatch(ActionCreators.redo()) },
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut()),
      'resetZoom': () => dispatch(resetZoom()),
      'shiftDown': () => this.setState({ shiftKey: true }),
      'shiftUp': () => this.setState({ shiftKey: false }),
      'delete': (event) => {
        event.preventDefault();
        dispatch(deleteSelection(selection));
      },
      'left': () => {dispatch(showAnnotation(prevIndex))},
      'right': () => {dispatch(showAnnotation(nextIndex))}
    }

    let graphApi = {
      getGraph: () => this.props.graph,
      zoomIn: () => dispatch(zoomIn()),
      zoomOut: () => dispatch(zoomOut()),
      resetZoom: () => dispatch(resetZoom()),
      prune: () => dispatch(pruneGraph()),
      circleLayout: () => dispatch(layoutCircle()),
      addNode: (node) => dispatch(addNode(node)),
      addEdge: (edge) => dispatch(addEdge(edge)),
      addCaption: (caption) => dispatch(addCaption(caption)),
      updateNode: (nodeId, data) => dispatch(updateNode(nodeId, data)),
      updateEdge: (edgeId, data) => dispatch(updateEdge(edgeId, data)),
      updateCaption: (captionId, data) => dispatch(updateCaption(captionId, data)),
      deselectAll: () => dispatch(deselectAll()),
      deleteAll: () => dispatch(deleteAll()),
      addSurroundingNodes: (centerId, nodes) => dispatch(addSurroundingNodes(centerId, nodes))
    };

    let clickNode = (nodeId) => { 
      isEditor && showEditTools ? 
      dispatch(swapNodeSelection(nodeId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapNodeHighlight(nodeId))) 
    }
    let clickEdge = (edgeId) => { 
      isEditor && showEditTools ? 
      dispatch(swapEdgeSelection(edgeId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapEdgeHighlight(edgeId)))
    }
    let clickCaption = (captionId) => { 
      isEditor && showEditTools ? 
      dispatch(swapCaptionSelection(captionId, !that.state.shiftKey)) : 
      (isLocked ? null : dispatch(swapCaptionHighlight(captionId)))
    }

    // annotations stuff

    let prevIndex = this.prevIndex();
    let nextIndex = this.nextIndex();
    let canClickPrev = !!prevIndex || prevIndex === 0;
    let canClickNext = !!nextIndex;

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

    let showAnnotations = this.showAnnotations();

    let fetchInterlocksCallback = (node1Id, node2Id) => {
      let nodeIds = Object.keys(that.props.graph.nodes);
      let apiCall = this.props.dataSource.getInterlocks.bind(this.props.dataSource);
      this.props.dispatch(fetchInterlocks(node1Id, node2Id, nodeIds, apiCall));
    }
    
    let containerStyle = isEmbedded ? {height: '100%', borderTop: '1px dotted #ccc', borderBottom: '1px dotted #ccc'} : {height: '100%'};
    let containerRowStyle = (isEmbedded && showAnnotations) ? {maxHeight: embedded.containerSize} : null;
    let headerRowStyle = (isEmbedded && showAnnotations) ? {maxHeight: embedded.headerSize} : null;
    let graphColumnStyle = (isEmbedded && showAnnotations) ? {maxHeight: embedded.graphColumnSize} : null;
    let graphContainerStyle = (isEmbedded && showAnnotations) ? {maxHeight: embedded.graphSize} : null;
    let annotationsContainerSyle = (isEmbedded && showAnnotations) ? {height: embedded.annotationSize} : null;
    
    return (
      <div id="oligrapherContainer" style={containerStyle} className="container-fluid">
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <div className="row" style={containerRowStyle} > {/* main container row */}
	    {/* Create a column for annotations if it's in editor mode or has annotations and they are visible.
		For 'embedded mode' the annotations will appear below the graph and we can use a full column here. */}
	      <div id="oligrapherGraphCol" className={ (showAnnotations && !isEmbedded) ? "col-md-8" : "col-md-12 col-sm-12"} style={graphColumnStyle} >
	      { (isEditor || title) &&
	        <div className="row" id="oligrapherHeaderRow" style={headerRowStyle}>
                  <GraphHeader
		      {...this.props}
		      updateTitle={updateTitle}
		      isEditor={isEditor} />
		</div>}

            <div className="row"  id="oligrapherGraphContainer" style={graphContainerStyle} >
              { graph && 
                  <Graph 
                    ref={(c) => { this.graph = c; if (c) { c.root = this; } }}
                    {...this.props}
                    graphApi={graphApi}
                    graph={annotatedGraph ? annotatedGraph : graph}
                    isEditor={isEditor}
                    isLocked={isLocked}
                    clickNode={clickNode}
                    clickEdge={clickEdge}
                    clickCaption={clickCaption}
                    moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
                    moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
                    moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} /> 
                }

                { graph &&
                  <Editor 
                    {...this.props}
                    delete={() => dispatch(deleteSelection(selection))}
                    graphApi={graphApi}
                    isEditor={isEditor} 
                    showEditButton={false} 
                    hideHelp={true} 
                    setNodeResults={(nodes) => dispatch(setNodeResults(nodes))}
                    toggleAddForm={(form) => dispatch(toggleAddForm(form))}
                    toggleHelpScreen={() => dispatch(toggleHelpScreen())}
                    undo={() => dispatch(ActionCreators.undo())}
                    redo={() => dispatch(ActionCreators.redo())} 
                    fetchInterlocks={fetchInterlocksCallback} />
                }

                <div id="oligrapherMetaButtons">
                  { isEditor && 
                    <EditButton toggle={() => this.toggleEditTools()} showEditTools={showEditTools} /> }
                  { isEditor && hasSettings && 
                    <SettingsButton toggleSettings={(value) => dispatch(toggleSettings(value))} /> }
                  { isEditor && 
                    <HelpButton toggleHelpScreen={() => dispatch(toggleHelpScreen())} /> }
                </div>

                { (isEditor && showSettings && hasSettings) &&  <GraphSettingsForm settings={graphSettings} updateSettings={updateSettings} /> }
              </div> {/* end div#oligrapherGraphContainer */}
            </div> {/* end div#oligrapherGraphCol */}
            { !isEmbedded && showAnnotations &&
	      <div className="col-md-4">
		  <GraphAnnotations 
                      isEditor={isEditor}
                      navList={isEditor}
                      prevClick={prevClick}
                      nextClick={nextClick}
                      canClickPrev={canClickPrev}
                      canClickNext={canClickNext}
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
                      hideEditTools={() => dispatch(toggleEditTools(false))} />
	      </div>
            }
           
	   { isEmbedded && showAnnotations &&
	     <div className="col-sm-12" style={annotationsContainerSyle}>
		 <EmbeddedGraphAnnotations
		     embedded={embedded}
                     currentIndex={currentIndex}
		     annotationCount={isArray(annotations) ? annotations.length : 0}
		     prevClick={prevClick}
                     nextClick={nextClick}
		     annotation={annotation}
		 />
	     </div>
	   }
	  </div> {/* end div.row */} 
          { !showAnnotations && this.enableAnnotations() &&
            <div id="oligrapherShowAnnotations">
              <button onClick={() => swapAnnotations()} className="btn btn-lg btn-default">
                <span className="glyphicon glyphicon-font"></span>
              </button>
            </div> 
          }
          { showSaveButton && isEditor && onSave && <SaveButton save={() => this.handleSave()} /> }
          { showHelpScreen && <HelpScreen source={this.props.dataSource} close={() => dispatch(toggleHelpScreen(false))} /> }
        </HotKeys>
      </div> 
    );
  }

  componentDidMount() {
    let { dispatch, data, settings, isEditor } = this.props;

    this.loadData(data);

    if (isEditor && (!data || !data.graph)) {
      // show edit tools if isEditor and there's no initial graph
      this.toggleEditTools(true);
    }

    if (settings) {
      dispatch(setSettings(settings));
    }
  }

  componentDidUpdate(prevProps) {
    let { selection, graph, onSelection } = this.props;

    if (JSON.stringify(prevProps.selection) !== JSON.stringify(selection)) {
      // if selection changed, fire selection callback with glorified selection state
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
    let { dispatch, startAnnotation } = this.props;

    // data provided from outside
    let graphData = (data && data.graph) ? merge(data.graph, {edges: legacyEdgesConverter(data.graph.edges)}) : null;
    let graph = (graphData) ? GraphModel.setDefaults(graphData) : GraphModel.defaults();
      
    dispatch(loadGraph(graph));

    if (data && data.title) {
      dispatch(setTitle(data.title));
    }

    if (data && data.annotations) {
      dispatch(loadAnnotations(data.annotations));

      startAnnotation = (data.annotations[startAnnotation] ? startAnnotation : 0);

      if (startAnnotation) {
        dispatch(showAnnotation(startAnnotation));
      }
    }

  }

  toggleEditor(value) {
    value = typeof value === "undefined" ? !this.state.isEditor : value;
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

  hasAnnotations() {
    return this.props.numAnnotations > 0;
  }

  enableAnnotations() {
    return (this.props.isEditor || this.hasAnnotations());
  }

  showAnnotations() {
   return this.props.visibleAnnotations && this.enableAnnotations();
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
        title: this.props.title,
        graph: this.graphWithoutHighlights(),
        annotations: this.props.annotations,
        settings: this.props.graphSettings
      });
    }
  }
}

function select(state) {
  return {
    graph: state.graph.present,
    canUndo: state.graph.past.length > 0,
    canRedo: state.graph.future.length > 0,
    selection: state.selection,
    zoom: state.zoom,
    showEditTools: state.editTools.visible,
    addForm: state.editTools.addForm,
    nodeResults: state.editTools.nodeResults,
    title: state.title,
    currentIndex: state.annotations.currentIndex,
    numAnnotations: state.annotations.list.length,
    annotation: state.annotations.list[state.annotations.currentIndex],
    annotations: state.annotations.list,
    visibleAnnotations: state.annotations.visible,
    graphSettings: state.settings,
    hasSettings: Object.keys(state.settings).length > 0,
    showHelpScreen: state.showHelpScreen,
    showSettings: state.showSettings
  };
}

export default connect(select, null, null, { withRef: true })(Root);
