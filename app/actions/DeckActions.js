const Marty = require('marty');
const DeckConstants = require('../constants/DeckConstants');

class DeckActions extends Marty.ActionCreators {
  selectDeck(id){
    this.dispatch(DeckConstants.DECK_SELECTED, id);
  }
  selectSlide(id){
    this.dispatch(DeckConstants.SLIDE_SELECTED, id);
  }
  incrementSlide(){
    this.dispatch(DeckConstants.NEXT_SLIDE_REQUESTED);
  }
  decrementSlide(){
    this.dispatch(DeckConstants.PREVIOUS_SLIDE_REQUESTED);
  }
}

module.exports = DeckActions;
