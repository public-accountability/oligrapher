const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const DeckTitle = require('./DeckTitle');
const GraphContainer = require('./GraphContainer');

class Deck extends BaseComponent {
  constructor(options){
    super(options);
  }

  render(){
    return (
      <DeckTitle />
      <GraphContainer />
    );
  }
}

module.exports = Marty.createContainer(Deck, {
  listenTo: ['graphStore'],
  fetch: {
    graph() {
      return this.app.graphStore.getCurrentGraph();
    }
  }
});
