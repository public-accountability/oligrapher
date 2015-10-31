import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph, zoomIn, zoomOut } from './actions';

var main = {
  run: function(elementId, graphData = null) {
    let store = createStore(reducers);
    Oligrapher.rootElement = document.getElementById(elementId);

    this.providerInstance = render(
      <Provider store={store}>
        <Root 
          data={graphData} 
          ref={(c) => Oligrapher.rootInstance = c} />
      </Provider>,
      Oligrapher.rootElement
    );

    return this.providerInstance;
  },

  load: function(graphData) {
    Oligrapher.rootInstance.dispatchProps.dispatch(loadGraph(graphData));
    Oligrapher.rootInstance.dispatchProps.dispatch(showGraph(graphData.id));
  },

  show: function(id) {
    Oligrapher.rootInstance.dispatchProps.dispatch(showGraph(id));
  },

  zoomIn: function(id) {
    Oligrapher.rootInstance.dispatchProps.dispatch(zoomIn());
  },

  zoomOut: function(id) {
    Oligrapher.rootInstance.dispatchProps.dispatch(zoomOut());
  },

  export: function() {
    return Oligrapher.graphInstance.props.graph;
  }
}

window.Oligrapher = main;

export default main;


