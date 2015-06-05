const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const util = require('./util/NavStoreUtil');
const GraphConstants = require('../constants/GraphConstants');
const _ = require('lodash');

class NavStore extends Marty.Store {
  constructor(options){
    super(options);
    this.fullMenu = [{
      header: 'Maps',
      selected: false,
      cells: [{
        name: 'Mitchell Family',
        action: [GraphConstants.SHOW_GRAPH, 556]
      }, {
        name: 'Berman-Considine',
        action: [GraphConstants.SHOW_GRAPH, 146]
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
    this.hasChanged();
  }
  handleCellClick(cell){
    this.setState({
      menu: util.deselectAll(this.state.menu)
    });
    this.hasChanged();
  }
}

module.exports = NavStore;
