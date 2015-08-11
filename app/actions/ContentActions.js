const Marty = require('marty');
const ContentConstants = require('../constants/ContentConstants');

class ContentActions extends Marty.ActionCreators {
  showHome() {
    this.dispatch(ContentConstants.HOME_SELECTED);
  }
  selectTab(tab) {
    this.dispatch(ContentConstants.TAB_SELECTED, tab);
  }
}

module.exports = ContentActions;
