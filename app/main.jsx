import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph, newGraph, 
         zoomIn, zoomOut, resetZoom,
         addNode, addEdge, addCaption, addSurroundingNodes,
         deleteNode, deleteEdge, deleteCaption, deleteAll,
         deselectAll, deleteSelection,
         updateNode, updateEdge, updateCaption,
         pruneGraph, layoutCircle,
         setHighlights, clearHighlights } from './actions';
import Graph from './models/Graph';
import merge from 'lodash/object/merge';
import difference from 'lodash/array/difference';
require ('./styles/oligrapher.css');

class Oligrapher {
  constructor(config = {}) {

    config = merge({ 
      isEditor: false, 
      isLocked: true, 
      logActions: false, 
      viewOnlyHighlighted: true 
    }, config);
    config.height = config.graphHeight || config.root.offsetHeight;

    this.rootElement = config.root;

    if (config.logActions) {
      const logger = createLogger();
      const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
      this.store = createStoreWithMiddleware(reducers);      
    } else {
      this.store = createStore(reducers);
    }

    this.providerInstance = render(
      <Provider store={this.store}>
        <Root 
          {...config}
          ref={(c) => this.root = c} />
      </Provider>,
      this.rootElement
    );

    this.Root = Root;

    return this;
  }

  toggleEditTools(value) {
    this.root.getWrappedInstance().toggleEditTools(value);
  }

  toggleEditor(value) {
    this.root.getWrappedInstance().toggleEditor(value);
  }

  toggleLocked(value) {
    this.root.getWrappedInstance().toggleLocked(value);
  }

  import(data) {
    this.root.dispatchProps.dispatch(loadGraph(data.graph));
    this.root.dispatchProps.dispatch(loadAnnotations(data.annotations));
    return this.root.getWrappedInstance().props.loadedId;
  }

  export() {
    let instance = this.root.getWrappedInstance();

    return {
      title: instance.props.graphTitle,
      graph: instance.graphWithoutHighlights(),
      annotations: instance.props.annotations,
      settings: instance.props.graphSettings
    };
  }

  exportGraph() {
    return this.root.getWrappedInstance().props.graph;
  }

  exportAnnotation() {
    return this.root.getWrappedInstance().props.annotation;
  }

  new() {
    this.root.dispatchProps.dispatch(newGraph());
    return this.currentGraphId();
  }

  showGraph(id) {
    this.root.dispatchProps.dispatch(showGraph(id));
  }

  showAnnotation(index) {
    this.root.dispatchProps.dispatch(showAnnotation(index));
  }

  zoomIn() {
    this.root.dispatchProps.dispatch(zoomIn());
  }

  zoomOut() {
    this.root.dispatchProps.dispatch(zoomOut());
  }

  resetZoom() {
    this.root.dispatchProps.dispatch(resetZoom())
  }

  currentGraphId() {
    return this.root.getWrappedInstance().props.graph.id;
  }

  addNode(node) {
    let nodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    this.root.dispatchProps.dispatch(addNode(this.currentGraphId(), node));
    let newNodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    return difference(newNodeIds, nodeIds);
  }

  addEdge(edge) {
    let edgeIds = Object.keys(this.root.getWrappedInstance().props.graph.edges);
    this.root.dispatchProps.dispatch(addEdge(this.currentGraphId(), edge));
    let newEdgeIds = Object.keys(this.root.getWrappedInstance().props.graph.edges);
    return difference(newEdgeIds, edgeIds);
  }

  addCaption(caption) {
    let captionIds = Object.keys(this.root.getWrappedInstance().props.graph.captions);
    this.root.dispatchProps.dispatch(addCaption(this.currentGraphId(), caption));
    let newCaptionIds = Object.keys(this.root.getWrappedInstance().props.graph.captions);
    return difference(newCaptionIds, captionIds);
  }

  addSurroundingNodes(centerId, nodes) {
    let nodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    this.root.dispatchProps.dispatch(addSurroundingNodes(this.currentGraphId(), centerId, nodes));
    let newNodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    return difference(newNodeIds, nodeIds);    
  }

  deleteNode(nodeId) {
    this.root.dispatchProps.dispatch(deleteNode(this.currentGraphId(), nodeId));
  }

  deleteEdge(edgeId) {
    this.root.dispatchProps.dispatch(deleteEdge(this.currentGraphId(), edgeId));
  }

  deleteCaption(captionId) {
    this.root.dispatchProps.dispatch(deleteCaption(this.currentGraphId(), captionId));
  }

  deleteAll() {
    this.root.dispatchProps.dispatch(deleteAll(this.currentGraphId()));
    this.root.getWrappedInstance().graph.recenter();
  }

  getHighlights() {
    return Graph.highlightedOnly(this.root.getWrappedInstance().props.graph);
  }

  setHighlights(highlights, otherwiseFaded = false) {
    this.root.dispatchProps.dispatch(setHighlights(this.currentGraphId(), highlights, otherwiseFaded));
    return this.root.getWrappedInstance().props.graph;
  }

  clearHighlights() {
    this.root.dispatchProps.dispatch(clearHighlights(this.currentGraphId()));
    return this.root.getWrappedInstance().props.graph;    
  }

  getSelection() {
    return this.root.getWrappedInstance().props.selection;
  }

  deselectAll() {
    this.root.dispatchProps.dispatch(deselectAll(this.currentGraphId()));
  }

  deleteSelection() {
    this.root.dispatchProps.dispatch(deleteSelection(this.currentGraphId(), this.getSelection()));
  }

  updateNode(nodeId, data) {
    this.root.dispatchProps.dispatch(updateNode(this.currentGraphId(), nodeId, data));
    return this.root.getWrappedInstance().props.graph.nodes[nodeId];
  }

  updateEdge(edgeId, data) {
    this.root.dispatchProps.dispatch(updateEdge(this.currentGraphId(), edgeId, data));
    return this.root.getWrappedInstance().props.graph.edges[edgeId];
  }

  updateCaption(captionId, data) {
    this.root.dispatchProps.dispatch(updateCaption(this.currentGraphId(), captionId, data));
    return this.root.getWrappedInstance().props.graph.captions[captionId];
  }

  prune() {
    this.root.dispatchProps.dispatch(pruneGraph(this.currentGraphId()));
  }

  circleLayout() {
    this.root.dispatchProps.dispatch(layoutCircle(this.currentGraphId()));
  }
};

module.exports = Oligrapher;