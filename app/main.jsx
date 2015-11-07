import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph, zoomIn, zoomOut } from './actions';

var main = {
  run: function(element, graphData = null) {
    this.rootElement = element;
    this.store = createStore(reducers);

    this.providerInstance = render(
      <Provider store={this.store}>
        <Root 
          data={graphData} 
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
  }
}

window.Oligrapher = main;

export default main;


