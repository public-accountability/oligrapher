import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph, newGraph, 
         zoomIn, zoomOut, resetZoom,
         addNode, addEdge, addCaption, 
         deleteNode, deleteEdge, deleteCaption, deleteAll,
         deselectAll, deleteSelection,
         updateNode, updateEdge, updateCaption,
         pruneGraph, layoutCircle } from './actions';
import Graph from './models/Graph';
import { merge, difference } from 'lodash';

const defaultConfig = { highlighting: true, isEditor: false };

const main = {
  run: function(element, config = {}) {
    this.rootElement = element;
    this.store = createStore(reducers);
    this.config = merge({}, defaultConfig, config);

    this.providerInstance = render(
      <Provider store={this.store}>
        <Root 
          data={this.config.data} 
          isEditor={this.config.isEditor}
          highlighting={this.config.highlighting}
          onSelection={config.onSelection}
          onUpdate={config.onUpdate}
          height={this.rootElement.clientHeight}
          ref={(c) => this.root = c} />
      </Provider>,
      this.rootElement
    );

    return this;
  },

  import: function(graphData) {
    this.root.dispatchProps.dispatch(loadGraph(graphData));
    return this.root.getWrappedInstance().props.loadedId;
  },

  export: function() {
    return this.root.getWrappedInstance().props.graph;
  },

  new: function() {
    this.root.dispatchProps.dispatch(newGraph());
    return this.currentGraphId();
  },

  show: function(id) {
    this.root.dispatchProps.dispatch(showGraph(id));
  },

  zoomIn: function() {
    this.root.dispatchProps.dispatch(zoomIn());
  },

  zoomOut: function() {
    this.root.dispatchProps.dispatch(zoomOut());
  },

  resetZoom: function() {
    this.root.dispatchProps.dispatch(resetZoom())
  },

  currentGraphId: function() {
    return this.root.getWrappedInstance().props.graph.id;
  },

  addNode: function(node) {
    let nodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    this.root.dispatchProps.dispatch(addNode(this.currentGraphId(), node));
    let newNodeIds = Object.keys(this.root.getWrappedInstance().props.graph.nodes);
    return difference(newNodeIds, nodeIds);
  },

  addEdge: function(edge) {
    let edgeIds = Object.keys(this.root.getWrappedInstance().props.graph.edges);
    this.root.dispatchProps.dispatch(addEdge(this.currentGraphId(), edge));
    let newEdgeIds = Object.keys(this.root.getWrappedInstance().props.graph.edges);
    return difference(newEdgeIds, edgeIds);
  },

  addCaption: function(caption) {
    let captionIds = Object.keys(this.root.getWrappedInstance().props.graph.captions);
    this.root.dispatchProps.dispatch(addCaption(this.currentGraphId(), caption));
    let newCaptionIds = Object.keys(this.root.getWrappedInstance().props.graph.captions);
    return difference(newCaptionIds, captionIds);
  },

  deleteNode: function(nodeId) {
    this.root.dispatchProps.dispatch(deleteNode(this.currentGraphId(), nodeId));
  },

  deleteEdge: function(edgeId) {
    this.root.dispatchProps.dispatch(deleteEdge(this.currentGraphId(), edgeId));
  },

  deleteCaption: function(captionId) {
    this.root.dispatchProps.dispatch(deleteCaption(this.currentGraphId(), captionId));
  },

  deleteAll: function() {
    this.root.dispatchProps.dispatch(deleteAll(this.currentGraphId()));
  },

  getHighlights: function() {
    return Graph.highlightedOnly(this.root.getWrappedInstance().props.graph);
  },

  getSelection: function() {
    return this.root.getWrappedInstance().props.selection;
  },

  deselectAll: function() {
    this.root.dispatchProps.dispatch(deselectAll(this.currentGraphId()));
  },

  deleteSelection: function() {
    this.root.dispatchProps.dispatch(deleteSelection(this.currentGraphId(), this.getSelection()));
  },

  updateNode: function(nodeId, data) {
    this.root.dispatchProps.dispatch(updateNode(this.currentGraphId(), nodeId, data));
    return this.root.getWrappedInstance().props.graph.nodes[nodeId];
  },

  updateEdge: function(edgeId, data) {
    this.root.dispatchProps.dispatch(updateEdge(this.currentGraphId(), edgeId, data));
    return this.root.getWrappedInstance().props.graph.edges[edgeId];
  },

  updateCaption: function(captionId, data) {
    this.root.dispatchProps.dispatch(updateCaption(this.currentGraphId(), captionId, data));
    return this.root.getWrappedInstance().props.graph.captions[captionId];
  },

  prune: function() {
    this.root.dispatchProps.dispatch(pruneGraph(this.currentGraphId()));
  },

  circleLayout: function() {
    this.root.dispatchProps.dispatch(layoutCircle(this.currentGraphId()));
  },

  findNode: function(name) {
    //TODO
  }
}

window.Oligrapher = main;

export default main;


