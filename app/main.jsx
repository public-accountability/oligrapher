const Marty = require('marty');
//const ApplicationContainer = Marty.ApplicationContainer;
const Root = require('./components/Root');
const React = require('react');
const Application = require('./application');

window.React = React;
window.Marty = Marty;

const app = new Application();
const { ApplicationContainer } = require('marty');

var main = {
  run: function(deckData = null) {
    let rootInstance = React.render((
      <ApplicationContainer app={app}>
        <Root data={deckData} />
      </ApplicationContainer>
    ), document.getElementById('story-map'));

    if (module.hot) {
      require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: () => [oligrapher]
      });
    }
  }
}

window.Oligrapher = main;

export default main;


