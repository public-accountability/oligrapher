const Marty = require('marty');
const sc = require('../constants/SearchConstants.js');

class EntitySearchStore extends Marty.Store {
  constructor(options){
    super(options);
    this.state = {};
    this.handlers = {
      receiveResults: sc.SEARCH_ENTITIES_DONE,
      receiveFailure: sc.SEARCH_ENTITIES_FAILED,
      clearResults: sc.CLEAR_ENTITY_SEARCH
    };
  }
  receiveResults(entities){
    this.state.results = entities;
    this.hasChanged();
  }
  receiveFailure(err){
    console.error('Entity Search Failed: ', err);
  }
  clearResults(){
    this.state.results = [];
    this.hasChanged();
  }
  getResults(){
    return this.state.results;
  }
}

module.exports = EntitySearchStore;
