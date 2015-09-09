const React = require('react');
const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const config = require('../../config');

class DeckByline extends BaseComponent {
  constructor(options){
    super(options);
  }

  render() {
    return this.props.deck.author ? (<div id="deckByline">
      by <a href={this.props.deck.authorUrl()}>{this.props.deck.author.name}</a> <span id="deckDate">{this.props.deck.date}</span>
    </div>) : (<div></div>);
  }
}

// module.exports = Marty.createContainer(DeckNavButtons);

module.exports = Marty.createContainer(DeckByline, {
  listenTo: ['deckStore'],
  fetch: {
    deck() {
      return this.app.deckStore.getCurrentDeck();
    }
  }
});