const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const GraphConstants = require('../constants/GraphConstants');

class NavActions extends Marty.ActionCreators {
  clickHeader(headerName){
    this.dispatch(NavConstants.CLICK_NAV_HEADER, headerName);
  }
  clickCell(cell){
    this.dispatch(NavConstants.CLICK_NAV_CELL, cell);
    this.dispatch(...cell.action);
  }
}

module.exports = NavActions;
