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
      addNode: gc.ADD_NODE
    };
  }
  addNode(node){
    this.state.graph = this.state.graph.addNode(node);
    this.hasChanged();
  }
  getGraph(){
    return this.state.graph;
  }
}

module.exports = GraphStore;
