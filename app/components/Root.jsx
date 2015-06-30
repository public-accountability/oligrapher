const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Header = require('./Header');
const Content = require('./Content');
const Footer = require('./Footer');
const { Grid } = require('react-bootstrap');
const yarr = require('yarr.js');

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render() {
    return (
      <Grid className="root" fluid={true}>
        <Header />
        <Content />
        <Footer />
      </Grid>
    );
  }

  componentDidMount(){
    this._defineRoutes();

    this.app.deckQueries.fetchDecks('frackingtest')
      .then(res => yarr())
      .catch(err => {
        throw new Error(err);
      });
  }

  _defineRoutes(){
    const that = this;
    yarr('/', function(ctx) {
      that.app.contentActions.showHome();
    });
    yarr('/maps/:id', function(ctx) {
      const match = ctx.params.id.match(/^\d+/);
      if (match) {
        that.app.deckActions.selectDeck(parseInt(match[0]));
      }
    });
    yarr('/maps/:id/:slide', function(ctx) {
      const match = ctx.params.id.match(/^\d+/);
      if (match) {
        that.app.deckActions.selectDeck(parseInt(match[0]));
        that.app.deckActions.selectSlide(parseInt(ctx.params.slide));
      }
    });
    yarr('*', function() { console.log("yarr didn't match map"); })
  }
}

module.exports = Marty.createContainer(Root);
