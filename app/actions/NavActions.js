const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');

class NavActions extends Marty.ActionCreators {
  clickHeader(name){
    this.dispatch(NavConstants.CLICK_NAV_HEADER, name);
  }
}

module.exports = NavActions;
