const Marty = require('marty');
const GraphConstants = require('../constants/GraphConstants');
const InfoConstants = require('../constants/InfoConstants');

class InfoActions extends Marty.ActionCreators {
  showMapInfo(id){
    this.dispatch(InfoConstants.SHOW_MAP_INFO, id);
  }
}

module.exports = InfoActions;
