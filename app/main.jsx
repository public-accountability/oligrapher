import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';
import { loadGraph, showGraph } from './actions';

var main = {
  run: function(graphData = null) {
    let store = createStore(reducers);
    let rootElement = document.getElementById('oligrapher');

    this.providerInstance = render(
      <Provider store={store}>
        <Root 
          data={graphData} 
          ref={(c) => Oligrapher.rootInstance = c} />
      </Provider>,
      rootElement
    );

    if (module.hot) {
      require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: () => [this.providerInstance]
      });
    }

    return this.providerInstance;
  },

  load: function(graphData) {
    Oligrapher.rootInstance.dispatchProps.dispatch(loadGraph(graphData));
    Oligrapher.rootInstance.dispatchProps.dispatch(showGraph(graphData.id));
  },

  export: function() {
    return Oligrapher.graphInstance.props.graph;
  }
}

window.Oligrapher = main;

export default main;


