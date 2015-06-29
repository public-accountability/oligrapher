const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const yarr = require('../yarr.js');

class DeckNavButtons extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_handlePrevSlideClick', '_handleNextSlideClick');
  }

  render(){
    return this.props.graph.isNull() ? (<div></div>) : (
      <div id="deckNavButtons">
        <button 
          id="prevSlideButton" 
          className="btn btn-sm btn-default" 
          disabled={this.props.isFirstSlide ? "disabled" : false} 
          onClick={this._handlePrevSlideClick}>Prev</button>
        <button 
          id="nextSlideButton" 
          className="btn btn-sm btn-default" 
          disabled={this.props.isLastSlide ? "disabled" : false} 
          onClick={this._handleNextSlideClick}>Next</button>
      </div>
    );
  }

  _handlePrevSlideClick() {
    yarr(`/maps/${this.props.deck.slugWithSlide(this.props.prevSlide)}`);
  }

  _handleNextSlideClick() {
    yarr(`/maps/${this.props.deck.slugWithSlide(this.props.nextSlide)}`);
  }

}

// module.exports = Marty.createContainer(DeckNavButtons);

module.exports = Marty.createContainer(DeckNavButtons, {
  listenTo: ['deckStore'],
  fetch: {
    isFirstSlide() {
      const store = this.app.deckStore;
      return store.isFirstSlide(store.getCurrentSlide());
    },
    isLastSlide() {
      const store = this.app.deckStore;
      return store.isLastSlide(store.getCurrentSlide());
    },
    prevSlide() {
      return this.app.deckStore.getPrevSlide();
    },
    nextSlide() {
      return this.app.deckStore.getNextSlide();
    },
    deck() {
      return this.app.deckStore.getCurrentDeck();
    }
  }
});