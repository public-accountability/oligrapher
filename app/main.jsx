import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph, zoomIn, zoomOut, addNode, addEdge } from './actions';
import Graph from './models/Graph';

var main = {
  run: function(element, config = {}) {
    this.rootElement = element;
    this.store = createStore(reducers);

    this.providerInstance = render(
      <Provider store={this.store}>
        <Root 
          data={config.data} 
          isEditor={!!config.isEditor}
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

  show: function(id) {
    this.root.dispatchProps.dispatch(showGraph(id));
  },

  zoomIn: function() {
    this.root.dispatchProps.dispatch(zoomIn());
  },

  zoomOut: function() {
    this.root.dispatchProps.dispatch(zoomOut());
  },

  addNode: function(node) {
    let graphId = this.root.getWrappedInstance().props.graph.id;
    this.root.dispatchProps.dispatch(addNode(graphId, node));
  },

  addEdge: function(edge) {
    let graphId = this.root.getWrappedInstance().props.graph.id;
    this.root.dispatchProps.dispatch(addEdge(graphId, edge));
  },

  getHighlighted: function() {
    return Graph.highlightedOnly(this.root.getWrappedInstance().props.graph);
  },

  findNode: function(name) {
    //TODO
  }
}

window.Oligrapher = main;

export default main;


