import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';

var main = {
  run: function(graphData = null) {
    let store = createStore(reducers);
    let rootElement = document.getElementById('oligrapher');

    this.rootInstance = render(
      <Provider store={store}>
        <Root data={graphData} />
      </Provider>,
      rootElement
    );

    if (module.hot) {
      require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: () => [this.rootInstance]
      });
    }

    return this.rootInstance;
  },

  export: function() {
    return Oligrapher.graphInstance.props.graph;
  }
}

window.Oligrapher = main;

export default main;


