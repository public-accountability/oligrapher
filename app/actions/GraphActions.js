const Marty = require('marty');
const gc = require('../constants/GraphConstants');
const sc = require('../constants/SearchConstants');
const lsApi = require('../api/lsApi');

class GraphActions extends Marty.ActionCreators {
  showGraph(id){
    this.dispatch(gc.SHOW_GRAPH, id);
  }
  addNode(node){
    this.dispatch(gc.ADD_NODE, node);
    this.dispatch(sc.CLEAR_ENTITY_SEARCH);
  }
  moveNode(id, position){
    this.dispatch(gc.MOVE_NODE, id, position);
  }
  moveEdge(id, x, y, cx, cy){
    this.dispatch(gc.MOVE_EDGE, id, x, y, cx, cy);
  }
  clickNode(nodeId){
    this.dispatch(gc.NODE_CLICKED, nodeId);
  }
  zoomIn(scale){
    this.dispatch(gc.ZOOMED_IN, scale);
  }
  zoomOut(scale){
    this.dispatch(gc.ZOOMED_OUT, scale);

  }
}

module.exports = GraphActions;
