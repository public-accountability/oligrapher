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
          ref={(c) => this.rootInstance = c} />
      </Provider>,
      this.rootElement
    );

    return this.providerInstance;
  },

  import: function(graphData) {
    this.rootInstance.dispatchProps.dispatch(loadGraph(graphData));
  },

  show: function(id) {
    this.rootInstance.dispatchProps.dispatch(showGraph(id));
  },

  zoomIn: function(id) {
    this.rootInstance.dispatchProps.dispatch(zoomIn());
  },

  zoomOut: function(id) {
    this.rootInstance.dispatchProps.dispatch(zoomOut());
  },

  export: function() {
    return this.rootInstance.getWrappedInstance().props.graph;
  }
}

window.Oligrapher = main;

export default main;


