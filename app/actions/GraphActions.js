const Marty = require('marty');
const gc = require('../constants/GraphConstants');
const sc = require('../constants/SearchConstants');
const lsApi = require('../api/lsApi');

class GraphActions extends Marty.ActionCreators {
  addNode(node){
    this.dispatch(gc.ADD_NODE, node);
    this.dispatch(sc.CLEAR_ENTITY_SEARCH);
  }
  moveNode(id, position){
    this.dispatch(gc.MOVE_NODE, id, position);
  }
}

module.exports = GraphActions;
