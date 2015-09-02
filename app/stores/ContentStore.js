const Marty = require('marty');
const ContentConstants = require('../constants/ContentConstants');
const DeckConstants = require('../constants/DeckConstants');

class ContentStore extends Marty.Store {

  constructor(options) {
    super(options);

    this.state = {
      content: 'empty',
      tab: 'graph'
    };

    this.handlers = {
      showHome: ContentConstants.HOME_SELECTED,
      showDeck: [DeckConstants.DECK_SELECTED, DeckConstants.SLIDE_SELECTED],
      showTab: ContentConstants.TAB_SELECTED
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

  showTab(tab) {
    this.setState({
      tab: tab
    });
  }

  getContent() {
    return this.state.content;
  }

  getTab() {
    return this.state.tab;
  }
}
 
module.exports = ContentStore;
