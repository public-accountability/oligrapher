const Marty = require('marty');
const GraphConstants = require('../constants/GraphConstants');
const DeckConstants = require('../constants/DeckConstants');
const Graph = require('../models/Graph');
const mapData = require('../../test/support/sampleData').mitchellMap; // TODO: unmock this!
const { fromJS, Map } = require('immutable');
const _ = require('lodash');

class GraphStore extends Marty.Store {
  constructor(options){
    super(options);
    const nullGraph = new Graph({id: -1});
    this.state = Map({
      graphs: Map({ [nullGraph.id]: nullGraph }),
    });

    this.handlers = {
      moveEdge: GraphConstants.MOVE_EDGE,
      addGraphsFromDecks: DeckConstants.FETCH_DECKS_DONE,
      addNode: GraphConstants.ADD_NODE,
      moveNode: GraphConstants.MOVE_NODE,
      zoom: [GraphConstants.ZOOMED_IN, GraphConstants.ZOOMED_OUT],
    };
  }

  //Graph methods
  addGraph(graph){
    this.replaceState(
      this.state.mergeDeep(
        Map({graphs: Map({[graph.id]: graph})})));
  }

  addGraphsFromDecks(specs){
    const newGraphs = Map(
      _(specs.graphs).map(d => [d.id, d]).zipObject().value());
    this.replaceState(
      this.state.mergeDeep(
        Map({graphs: newGraphs})));
  }

  getGraph(id){
    return this.fetch({
      id: 'getGraph',
      locally: () => this.state.getIn(['graphs', id.toString()])
    });
  }

  zoom(scale){
    const cg = this.getCurrentGraph().result;
    const oldShrinkFactor = cg.display.shrinkFactor;
    let newShrinkFactor = oldShrinkFactor * 1/scale;
    newShrinkFactor = Math.round(newShrinkFactor * 100) / 100;
    this.replaceState(
      this.state.mergeDeep(
        Map({graphs: Map({
          [cg.id]: cg.setShrinkFactor(newShrinkFactor)})})));
    this.hasChanged();
  }

  //Node methods
  addNode(node){
    const cg = this.getCurrentGraph().result;
    this.replaceState(
      this.state.mergeDeep(
        Map({graphs: Map({
          [cg.id]: cg.addNode(node)})})));
    this.hasChanged();
  }

  moveNode(nodeId, position){
    const cg = this.getCurrentGraph().result;
    this.replaceState(
      this.state.mergeDeep(
        Map({ graphs: Map({
          [cg.id]: cg.moveNode(nodeId, position)})})));
    this.hasChanged();
  }

  moveEdge(id, x, y, cx, cy){
    const cg = this.getCurrentGraph().result;
    this.replaceState(
      this.state.mergeDeep(
        Map({graphs: Map({
          [cg.id]: cg.moveEdge(id, x, y, cx, cy)})})));
    this.hasChanged();
  }

  getNode(graphId, nodeId){
    return this.state.get('graphs').get(graphId).nodes.get(nodeId);
  }

  //Edge methods
  getEdge(graphId, edgeId){
    return this.state.get('graphs').get(graphId).edges.get(edgeId);
  }
}

module.exports = GraphStore;
