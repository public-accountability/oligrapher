const Marty = require('marty');
const DeckConstants = require('../constants/DeckConstants');

class DeckActions extends Marty.ActionCreators {
  selectDeck(index){
    this.dispatch(DeckConstants.DECK_SELECTED, index);
  }
  selectSlide(index){
    this.dispatch(DeckConstants.SLIDE_SELECTED, index);
  }
  incrementSlide(){
    this.dispatch(DeckConstants.NEXT_SLIDE_REQUESTED);
  }
  decrementSlide(){
    this.dispatch(DeckConstants.PREVIOUS_SLIDE_REQUESTED);
  }
}

module.exports = DeckActions;
