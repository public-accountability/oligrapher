const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class DeckTitle extends BaseComponent {
  constructor(options){
    super(options);
  }

  render(){
    return this.props.isNullPosition ? (<h1></h1>) : (
      <h1 id="deckTitle">
        {this.props.title}
      </h1>
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

module.exports = Marty.createContainer(DeckTitle, {
  listenTo: ['deckStore'],
  fetch: {
    isNullPosition() {
      return this.app.deckStore.isNullPosition();
    },
    title() {
      return this.app.deckStore.getCurrentTitle();
    }
  }
});