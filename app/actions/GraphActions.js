const Marty = require('marty');
const GraphConstants = require('../constants/GraphConstants');
const sc = require('../constants/SearchConstants');
const lsApi = require('../api/lsApi');

class GraphActions extends Marty.ActionCreators {
  showGraph(id){
    this.dispatch(GraphConstants.SHOW_GRAPH, id); //TODO: rename to GRAPH_SELECTED
  }
  addNode(node){
    this.dispatch(GraphConstants.ADD_NODE, node);
    this.dispatch(sc.CLEAR_ENTITY_SEARCH);
  }
  moveNode(id, position){
    this.dispatch(GraphConstants.MOVE_NODE, id, position);
  }
  moveEdge(id, x, y, cx, cy){
    this.dispatch(GraphConstants.MOVE_EDGE, id, x, y, cx, cy);
  }
  clickNode(nodeId){
    this.dispatch(GraphConstants.NODE_CLICKED, nodeId);
  }
  zoomIn(scale){
    this.dispatch(GraphConstants.ZOOMED_IN, scale);
  }
  zoomOut(scale){
    this.dispatch(GraphConstants.ZOOMED_OUT, scale);

  }
}

module.exports = GraphActions;
