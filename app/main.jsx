const Marty = require('marty');
//const ApplicationContainer = Marty.ApplicationContainer;
const Root = require('./components/Root.jsx');
const React = require('react');
const Application = require('./application');

window.React = React;
window.Marty = Marty;

//if (process.env.NODE_ENV !== 'test'){

const app = new Application();
const { ApplicationContainer } = require('marty');
/* React.render((
   <ApplicationContainer app={app}>
   <Root />
   </ApplicationContainer>
   ), document.getElementById('content')); */
let rootInstance = React.render((
  <ApplicationContainer app={app}>
    <Root />
  </ApplicationContainer>
), document.getElementById('content'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: () => [rootInstance]
  });
}


//}
