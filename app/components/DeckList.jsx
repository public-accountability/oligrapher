const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const yarr = require('yarr.js');
const RoutesHelper = require('../routes/RoutesHelper');
const _ = require('lodash');

class DeckList extends BaseComponent {
  constructor(options){
    super(options);
  }

  render(){
    return (
      <div id="deckList">
        { this.props.decks.map((d) =>
          <div>
            <a href={RoutesHelper.mapUrl(d)} onClick={this._handleDeckClick.bind(this, d)}>{d.title}</a>
          </div>
        ) }
      </div>
    );
  }

  _handleDeckClick(deck) {
    yarr(RoutesHelper.mapUrl(deck));
    return false;
  }
}

module.exports = Marty.createContainer(DeckList, {
  listenTo: ['deckStore'],
  fetch: {
    decks() {
      return _.values(this.app.deckStore.getDecks());
    }
  }
});