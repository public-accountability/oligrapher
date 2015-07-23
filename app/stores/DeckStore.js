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
      decks: { [nullDeck.id]: nullDeck },
      position: nullPosition,
      shrinkFactor: 1.2
    };

    this.handlers = {
      addDeck: DeckConstants.FETCH_DECK_DONE,
      addDecks: DeckConstants.FETCH_DECKS_DONE,
      setCurrentDeck: DeckConstants.DECK_SELECTED,
      setCurrentSlide: DeckConstants.SLIDE_SELECTED,
      incrementSlide: DeckConstants.NEXT_SLIDE_REQUESTED,
      decrementSlide: DeckConstants.PREVIOUS_SLIDE_REQUESTED,
      zoom: [DeckConstants.ZOOMED_IN, DeckConstants.ZOOMED_OUT]
    };
  }

  addDeck(specs){
    const deck = specs.deck;
    this.setState({
      decks: _.merge(this.state.decks, { [deck.id]: deck })
    });
  }

  addDecks(specs){
    this.waitFor(this.app.graphStore);
    this.setState({
      decks: _(specs.decks).map(d => [d.id, d]).zipObject().value()
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
    return this.getDeck(this.state.position.deck);
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

  getDeck(id) {
    // return this.fetch({
    //   id: id,
    //   locally: () => this.state.decks[id],
    //   remotely: () => this.app.deckQueries.fetchDeck(id)
    // }).result;

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

  getCurrentGraphId() {
    return this.getCurrentDeck().graphIds[this.state.position.slide];
  }

  zoom(scale) {
    const oldShrinkFactor = this.state.shrinkFactor;
    let newShrinkFactor = oldShrinkFactor * 1/scale;
    newShrinkFactor = Math.round(newShrinkFactor * 100) / 100;
    this.setState({
      shrinkFactor: newShrinkFactor
    });
  }

  getShrinkFactor() {
    return this.state.shrinkFactor;
  }

  _prevSlide(currentSlide) {
    return this.isFirstSlide(currentSlide) ? currentSlide : this.state.position.slide - 1;
  }

  _nextSlide(currentSlide) {
    return this.isLastSlide(currentSlide) ? currentSlide : currentSlide + 1;
  }
}

module.exports = DeckStore;
