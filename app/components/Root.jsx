const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Header = require('./Header');
const Content = require('./Content');
const Footer = require('./Footer');
const { Grid } = require('react-bootstrap');
const yarr = require('yarr.js');
const RoutesHelper = require('../routes/RoutesHelper');

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

    yarr(`/${RoutesHelper.mapBasePath()}/:id`, function(ctx) {
      const match = ctx.params.id.match(/^\d+/);
      
      if (match) {
        const id = parseInt(match[0]);
        that.app.deckQueries.fetchDeck(id)
          .then(res => {
            that.app.deckActions.selectDeck(id);
          });
      }
    });

    yarr(`/${RoutesHelper.mapBasePath()}/:id/:slide`, function(ctx) {
      const match = ctx.params.id.match(/^\d+/);

      if (match) {
        const id = parseInt(match[0]);

        if (that.app.deckStore.getDeck(id)) {
          that.app.deckActions.selectDeck(id);
          that.app.deckActions.selectSlide(parseInt(ctx.params.slide));
        } else {
          that.app.deckQueries.fetchDeck(id)
            .then(res => {
              that.app.deckActions.selectDeck(id);
              that.app.deckActions.selectSlide(parseInt(ctx.params.slide));
            });
        }
      }
    });
    
    yarr('*', function() { })
  }
}

module.exports = Marty.createContainer(Root);
