const Marty = require('marty');
const DeckConstants = require('../constants/DeckConstants');

class DeckActions extends Marty.ActionCreators {
  selectDeck(id){
    this.dispatch(DeckConstants.DECK_SELECTED, id);
  }
  selectSlide(id, index){
    this.dispatch(DeckConstants.SLIDE_SELECTED, id, index);
  }
  incrementSlide(){
    this.dispatch(DeckConstants.NEXT_SLIDE_REQUESTED);
  }
  decrementSlide(){
    this.dispatch(DeckConstants.PREVIOUS_SLIDE_REQUESTED);
  }
  zoomIn(scale = 1.2){
    this.dispatch(DeckConstants.ZOOMED_IN, scale);
  }
  zoomOut(scale = 0.8333){
    this.dispatch(DeckConstants.ZOOMED_OUT, scale);
  }
  importDeck(deck, graphs){
    this.dispatch(DeckConstants.DECK_IMPORTED, { deck: deck, graphs: graphs });
    this.dispatch(DeckConstants.DECK_SELECTED, deck.id);
  }
}

module.exports = DeckActions;
