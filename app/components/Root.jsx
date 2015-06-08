const BaseComponent = require('./BaseComponent');
const Header = require('./Header');
const MainContainer = require('./MainContainer');
const Footer = require('./Footer');
const { Grid } = require('react-bootstrap');

class Root extends BaseComponent {
  constructor(){
    super();
  }
  render() {
    return (
      <Grid className="root">
        <Header />
        <MainContainer />
        <Footer />
      </Grid>

    );
  }
}

module.exports = Root;
