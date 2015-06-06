const Marty = require('marty');
const sc = require('../constants/SearchConstants');

class EntitySearchStore extends Marty.Store {
  constructor(options){
    super(options);
    this.state = { results: [] , visible: false };
    this.handlers = {
      receiveResults: sc.SEARCH_ENTITIES_DONE,
      receiveFailure: sc.SEARCH_ENTITIES_FAILED,
      clearResults: sc.CLEAR_ENTITY_SEARCH
    };
  }
  receiveResults(entities){
    this.setState({
      results: entities,
      visible: true
    });
    this.hasChanged();
  }
  receiveFailure(err){
    console.error('Entity Search Failed: ', err);
  }
  clearResults(){
    this.setState({
      results: [],
      visible: false
    });
    this.hasChanged();
  }
}

module.exports = EntitySearchStore;
