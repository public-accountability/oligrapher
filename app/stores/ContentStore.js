const Marty = require('marty');
const ContentConstants = require('../constants/ContentConstants');
const DeckConstants = require('../constants/DeckConstants');

class ContentStore extends Marty.Store {

  constructor(options) {
    super(options);

    this.state = {
      content: 'empty'
    };

    this.handlers = {
      showHome: ContentConstants.HOME_SELECTED,
      showDeck: DeckConstants.DECK_SELECTED
    };
  }

  showEmpty() {
    this.setState({
      content: 'empty'
    });    
  }

  showHome() {
    this.setState({
      content: 'home'
    });    
  }

  showDeck() {
    this.setState({
      content: 'deck'
    });
  }

  getContent() {
    return this.state.content;
  }
}
 
module.exports = ContentStore;
