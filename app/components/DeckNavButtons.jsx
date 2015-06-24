const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

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
    this.app.deckActions.decrementSlide();
  }

  _handleNextSlideClick() {
    this.app.deckActions.incrementSlide();
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
    }
  }
});