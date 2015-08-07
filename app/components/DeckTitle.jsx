const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const config = require('../../config');
const DeckByline = require('./DeckByline');

class DeckTitle extends BaseComponent {
  constructor(options){
    super(options);
  }

  render() {
    return this.props.isNullPosition ? (<h1></h1>) : (
      <div id="deckTitle">
        <h1>{this.props.deck.title}</h1>
        <DeckByline />
      </div>
    );
  }

  componentDidMount() {
    document.title = this.props.deck.title + " - " + config.brandName;
  }  

  _handlePrevSlideClick() {
    this.app.deckActions.decrementSlide();
  }

  _handleNextSlideClick() {
    this.app.deckActions.incrementSlide();
  }

}

// module.exports = Marty.createContainer(DeckNavButtons);

module.exports = Marty.createContainer(DeckTitle, {
  listenTo: ['deckStore'],
  fetch: {
    isNullPosition() {
      return this.app.deckStore.isNullPosition();
    },
    deck() {
      return this.app.deckStore.getCurrentDeck();
    }
  }
});