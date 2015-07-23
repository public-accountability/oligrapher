const Marty = require('marty');
const GraphConstants = require('../constants/GraphConstants');
const DeckConstants = require('../constants/DeckConstants');
const Graph = require('../models/Graph');
const mapData = require('../../test/support/sampleData').mitchellMap; // TODO: unmock this!
const _ = require('lodash');

class GraphStore extends Marty.Store {
  constructor(options){
    super(options);
    const nullGraph = new Graph({id: -1});
    this.state = {
      graphs: { [nullGraph.id]: nullGraph },
    };

    this.handlers = {
      moveEdge: GraphConstants.MOVE_EDGE,
      addGraphsFromDecks: [DeckConstants.FETCH_DECKS_DONE, DeckConstants.FETCH_DECK_DONE],
      addNode: GraphConstants.ADD_NODE,
      moveNode: GraphConstants.MOVE_NODE,
      zoom: [GraphConstants.GRAPH_ZOOMED_IN, GraphConstants.GRAPH_ZOOMED_OUT],
    };
  }

  //Graph methods
  addGraph(graph){
    this.setState({ 
      graphs: _.merge(this.state.graphs, { [graph.id]: graph }) 
    });
  }

  addGraphsFromDecks(specs){
    const newGraphs = _(specs.graphs).map(d => [d.id, d]).zipObject().value();
    this.setState({ 
      graphs: _.merge(this.state.graphs, newGraphs) 
    });
  }

  getGraph(id){
    return this.fetch({
      id: id,
      locally: () => this.state.graphs[id.toString()]
    });
  }

  zoom(scale){
    const cg = this.getCurrentGraph().result;
    const oldShrinkFactor = cg.display.shrinkFactor;
    let newShrinkFactor = oldShrinkFactor * 1/scale;
    newShrinkFactor = Math.round(newShrinkFactor * 100) / 100;
    this.setState({ 
      graphs: { [cg.id]: cg.setShrinkFactor(newShrinkFactor) }
    });
    this.hasChanged();
  }

  //Node methods
  addNode(node){
    const cg = this.getCurrentGraph().result;
    this.setState({ 
      graphs: _.merge(this.state.graphs, { [cg.id]: cg.addNode(node) })  
    });
    this.hasChanged();
  }

  moveNode(nodeId, position){
    const cg = this.getCurrentGraph().result;
    this.setState({ 
      graphs: _.merge(this.state.graphs, { [cg.id]: cg.moveNode(nodeId, position) })
    });
    this.hasChanged();
  }

  moveEdge(id, x, y, cx, cy){
    const cg = this.getCurrentGraph().result;
    this.setState({ 
      graphs: _.merge({ [cg.id]: cg.moveEdge(id, x, y, cx, cy) })
    });
    this.hasChanged();
  }

  getNode(graphId, nodeId){
    return this.state.graphs[graphId].nodes[nodeId];
  }

  //Edge methods
  getEdge(graphId, edgeId){
    return this.state.graphs[graphId].edges[edgeId];
  }
}

module.exports = GraphStore;
