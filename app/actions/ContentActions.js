const Marty = require('marty');
const ContentConstants = require('../constants/ContentConstants');

class ContentActions extends Marty.ActionCreators {
  showHome() {
    this.dispatch(ContentConstants.HOME_SELECTED);
  }
}

module.exports = ContentActions;
