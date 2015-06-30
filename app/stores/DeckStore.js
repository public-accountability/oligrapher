const Marty = require('marty');
const Deck = require('../models/Deck');
const DeckConstants = require('../constants/DeckConstants');
const _ = require('lodash');

class DeckStore extends Marty.Store {

  constructor(options){
    super(options);
    const nullDeck = new Deck({});
    const nullPosition = { deck: -1, slide: -1 };

    this.state = {
      decks: [nullDeck],
      position: nullPosition
    };

    this.handlers = {
      addDecks: DeckConstants.FETCH_DECKS_DONE,
      setCurrentDeck: DeckConstants.DECK_SELECTED,
      setCurrentSlide: DeckConstants.SLIDE_SELECTED,
      incrementSlide: DeckConstants.NEXT_SLIDE_REQUESTED,
      decrementSlide: DeckConstants.PREVIOUS_SLIDE_REQUESTED
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

  setCurrentSlide(index){
    this.setState({
      position: { deck: this.state.position.deck, slide: index }
    });
  }

  incrementSlide(){
    const index = this._nextSlide(this.state.position.slide);
    this.replaceState(_.merge({}, this.state, {
      position: { slide: index }
    }));
  }

  decrementSlide(){
    const index = this._prevSlide(this.state.position.slide);
    this.replaceState(_.merge({}, this.state, {
      position: { slide: index }
    }));
  }

  getCurrentDeck() {
    return this.getDeckById(this.state.position.deck);
  }

  getCurrentTitle() {
    const deck = this.getCurrentDeck();
    return deck ? deck.title : "";
  }

  isFirstSlide(slide) {
    return !this.isNullPosition() && slide == 0;
  }

  isLastSlide(slide) {
    return !this.isNullPosition() && slide == this.getCurrentDeck().graphIds.length - 1;
  }

  isNullPosition() {
    return this.state.position.deck == -1;
  }

  getCurrentSlide() {
    return this.state.position.slide;
  }

  getDeckById(id) {
    return _.find(this.state.decks, d => d.id === id);
  }

  getPrevSlide() {
    return this._prevSlide(this.state.position.slide);
  }

  getNextSlide() {
    return this._nextSlide(this.state.position.slide);
  }

  getDecks() {
    return this.state.decks;
  }

  _prevSlide(currentSlide) {
    return this.isFirstSlide(currentSlide) ? currentSlide : this.state.position.slide - 1;
  }

  _nextSlide(currentSlide) {
    return this.isLastSlide(currentSlide) ? currentSlide : currentSlide + 1;
  }
}

module.exports = DeckStore;
