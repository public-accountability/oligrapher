const Marty = require('marty');
const InfoConstants = require('../constants/InfoConstants');
const Immutable = require('immutable');

class InfoStore extends Marty.Store {
  constructor(options){
    super(options);
    this.state = Immutable.Map({info: Immutable.Map({})});
    this.handlers = ({
      showMapInfo: InfoConstants.SHOW_MAP_INFO
    });
  }
  showMapInfo(){

  }
}

module.exports = InfoStore;
