const Marty = require('marty');
const InfoConstants = require('../constants/InfoConstants');
const GraphConstants = require('../constants/GraphConstants');
const { Map } = require('immutable');

class InfoStore extends Marty.Store {
  constructor(options){
    super(options);
    this.state = Map({
      type: 'empty',
      id: null
    });
    this.handlers = ({
      setGraphInfo: GraphConstants.SHOW_GRAPH // GRAPH_SELECTED
    });
  }
  setGraphInfo(id){
    this.waitFor(this.app.graphStore);
    this.replaceState(Map({type: 'map', id: id}));
  }
  getGraphInfo(){
    const id = this.state.get('id');
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
}

module.exports = InfoStore;
