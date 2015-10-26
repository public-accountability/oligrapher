import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import oligrapherApp from './reducers';

var main = {
  run: function(graphData = null) {
    let store = createStore(oligrapherApp);
    let rootElement = document.getElementById('oligrapher');

    let rootInstance = render(
      <Provider store={store}>
        <Root data={graphData} />
      </Provider>,
      rootElement
    );

    if (module.hot) {
      require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: () => [rootInstance]
      });
    }
  }
}

window.Oligrapher = main;

export default main;


