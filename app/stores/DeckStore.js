const Marty = require('marty');
const Deck = require('../models/Deck');
const DeckConstants = require('../constants/DeckConstants');

class DeckStore extends Marty.Store {

  constructor(options){
    super(options);
    const nullDeck = new Deck({});
    const nullPosition = { deck: -1, slide: -1 };

    this.state = {
      decks: { [nullDeck.id]: nullDeck },
      position: nullPosition
    };

    this.handlers = {
      addDecks: DeckConstants.FETCH_DECKS_DONE,
      setCurrentDeck: DeckConstants.DECK_SELECTED
    };
  }

  addDecks(specs){
    this.waitFor(this.app.graphStore);
    this.setState({
      decks: specs.decks
    });
  }

  setCurrentDeck(id){
    this.setState({
      position: { deck: id, slide: 0 }
    });

  }




}

module.exports = DeckStore;
