const Marty = require('marty');
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
      <Grid className="root" fluid={true}>
        <Header />
        <MainContainer />
        <Footer />
      </Grid>

    );
  }
  componentDidMount(){
    this.app.deckQueries.fetchDecks('fracking');
  }
}

module.exports = Marty.createContainer(Root);
