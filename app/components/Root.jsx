const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Header = require('./Header');
const MainContainer = require('./MainContainer');
const Footer = require('./Footer');
const { Grid } = require('react-bootstrap');
const yarr = require('../yarr.js');

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
    const that = this;
    yarr('/maps/:id', function(ctx) {
      const match = ctx.params.id.match(/\d+/);
      if (match) {
        that.app.deckActions.selectDeck(parseInt(match[0]));
      }
    });
    yarr('/maps/:id/:slide', function(ctx) {
      const match = ctx.params.id.match(/\d+/);
      if (match) {
        that.app.deckActions.selectDeck(parseInt(match[0]));
        that.app.deckActions.selectSlide(parseInt(ctx.params.slide));
      }
    });        
    yarr('*', function() { console.log("yarr didn't match map"); })
    const callback = function() {
      yarr();
    };

    this.app.deckQueries.fetchDecks('frackingtest', callback);
  }
}

module.exports = Marty.createContainer(Root);
