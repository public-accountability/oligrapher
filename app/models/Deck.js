const Graph = require('./Graph');
const _ = require('lodash');

class Deck {

  constructor(specs){
    this.id = specs.id || -1;
    this.title = specs.title || 'empty deck';
    this.graphIds = specs.graphIds || [];
  }

  hasSlides() {
    return this.graphIds.length > 1;
  }

  //parseApiGraph(apiDecks): { decks: [Deck], graphs: [Graph] }
  static parseApiDecks(apiDecks) {
    const [decks, graphs] = _.unzip(apiDecks.map(this.parseApiDeck));
    return { decks: decks, graphs: _.flatten(graphs)};
  }

  //parseApiDeck(apiDeck): [Deck,[Graph]]
  static parseApiDeck(apiDeck) {
    return [
      new Deck({
        id: apiDeck.id,
        title: apiDeck.title,
        graphIds: apiDeck.maps.map(m => m.id)
      }),
      apiDeck.maps.map(Graph.parseApiGraph)
    ];
  }
}

module.exports = Deck;
