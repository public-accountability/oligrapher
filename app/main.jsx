const React = require('react');
const Marty = require('marty');
const Application = require('./application');
const ApplicationContainer = Marty.ApplicationContainer;
const Root = require('./components/Root');

window.React = React;
window.Marty = Marty;

if (process.env.NODE_ENV !== 'test'){

  const app = new Application();
  //const { ApplicationContainer } = require('marty')

  React.render((
    <ApplicationContainer app={app}>
      <Root />
    </ApplicationContainer>
  ), document.getElementById('content'));
}
