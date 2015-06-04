const Marty = require('marty');
const gc = require('../constants/GraphConstants');
const Graph = require('../models/Graph');
const mapData = require('../../test/support/sampleData').mitchellMap; // TODO: unmock this!

class GraphStore extends Marty.Store {
  constructor(options){
    super(options);
    // this.state = { graph: new Graph({})};
    this.state = { graph: new Graph({}).importMap(mapData) }; //TODO: unmock this!
    this.handlers = {
      addNode: gc.ADD_NODE,
      moveNode: gc.MOVE_NODE,
      moveEdge: gc.MOVE_EDGE
    };
  }
  addNode(node){
    this.state.graph = this.state.graph.addNode(node);
    this.hasChanged();
  }
  moveNode(id, position){
    this.state.graph = this.state.graph.moveNode(id, position);
    this.hasChanged();
  }
  moveEdge(id, x, y, cx, cy){
    this.state.graph = this.state.graph.moveEdge(id, x, y, cx, cy);
    this.hasChanged();
  }
  getGraph(){
    return this.state.graph;
  }
  getNode(id){
    return this.state.graph.nodes.get(id);
  }
  getEdge(id){
    return this.state.graph.edges.get(id);
  }
}

module.exports = GraphStore;
