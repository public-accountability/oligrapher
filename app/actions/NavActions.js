const Marty = require('marty');
const NavConstants = require('../constants/NavConstants');
const GraphConstants = require('../constants/GraphConstants');
const InfoConstants = require('../constants/InfoConstants');

class NavActions extends Marty.ActionCreators {
  selectMap(id){
    this.dispatch(GraphConstants.SHOW_GRAPH, id);
    this.dispatch(InfoConstants.SHOW_MAP_INFO, id);
  }
}

module.exports = NavActions;
