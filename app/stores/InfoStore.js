const Marty = require('marty');
const InfoConstants = require('../constants/InfoConstants');
const GraphConstants = require('../constants/GraphConstants');
const DeckConstants = require('../constants/DeckConstants');
const { Map } = require('immutable');

class InfoStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      type: 'empty',
      id: null
    });
    this.handlers = ({
      setGraphInfo: [
        DeckConstants.DECK_SELECTED,
        DeckConstants.PREVIOUS_SLIDE_REQUESTED,
        DeckConstants.NEXT_SLIDE_REQUESTED,
        DeckConstants.SLIDE_SELECTED
      ],
      setNodeInfo: GraphConstants.NODE_CLICKED
    });
  }

  setGraphInfo(){
    this.setInfo('map', this.app.deckStore.getCurrentGraphId());
  }

  setNodeInfo(id){
    this.setInfo('node', id);
  }

  setInfo(type, id){//TODO: add param about graph_id into each node, so they can be passed here?
    this.replaceState(Map({type: type, id: id}));
  }

  getGraphInfo(id){
    return this.fetch({
      id: 'getGraphInfo',
      dependsOn: [this.app.graphStore.getGraph(id)],
      locally() {
        const g = this.app.graphStore.getGraph(id).result;
        return Map({
          title: g.display.title,
          description: g.display.description
        });
      }
    });
  }

  getNodeInfo(){
    const id = this.state.get('id');
    return this.fetch({
      id: 'getNodeInfo',
      dependsOn: [this.app.graphStore.getGraph(this.app.deckStore.getCurrentGraphId())],
      locally() {
        const n = this.app.graphStore.getGraph(this.app.deckStore.getCurrentGraphId()).result.nodes.get(id);
        return this._parseNode(n);
      }
    });
  }

  _parseNode(n){
    return Map({
      title: n.content.entity.name,
      text: n.content.entity.description,
      longText: n.content.entity.summary
    });
  }
}

module.exports = InfoStore;
