const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const util = require('./util/NavStoreUtil');
const _ = require('lodash');

class NavStore extends Marty.Store {
  constructor(options){
    super(options);
    this.fullMenu = [{
      header: 'Maps',
      selected: false,
      cells: [{
        name: 'Mitchell Family',
        id: 556,
        action: 'showGraph'
      }, {
        name: 'Berman-Considine',
        id: 146,
        action: 'showGraph'
      }]
    }];
    this.state = { menu: util.deselectAll(this.fullMenu) };
    this.handlers = {
      handleHeaderClick: NavConstants.CLICK_NAV_HEADER,
      handleCellClick: NavConstants.CLICK_NAV_CELL
    };
  }
  handleHeaderClick(header){
    this.setState({
      menu: util.selectColumn(this.state.menu, this.fullMenu, header)
    });
  }
  handleCellClick(cell){
    this.setState({
      menu: util.deselectAll(this.state.menu)
    });
  }
}

module.exports = NavStore;
