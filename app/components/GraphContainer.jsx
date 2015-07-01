const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Graph = require('./Graph');
const DeckNavButtons = require('./DeckNavButtons');

class GraphContainer extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_handleZoomIn', '_handleZoomOut');
  }

  render(){
    const zoomButtons = this.props.graph.isNull() ? null : (
      <div id="zoomButtons">
        <button id="zoom-in" className="zoomButton" onClick={this._handleZoomIn}>+</button>
        <button id="zoom-out" className="zoomButton" onClick={this._handleZoomOut}>&ndash;</button>
      </div>
    );

    return (
      <div className="graphContainer">
        {zoomButtons}
        <DeckNavButtons graph={this.props.graph} />
        <Graph graph={this.props.graph} />
      </div>
    );
  }

  _handleZoomIn() {
    this.app.deckActions.zoomIn(1.2);
  }

  _handleZoomOut() {
    this.app.deckActions.zoomOut(0.8333);
  }
}

module.exports = Marty.createContainer(GraphContainer, {
  listenTo: ['deckStore'],
  fetch: {
    graph() {
      return this.app.graphStore.getGraph(this.app.deckStore.getCurrentGraphId());
    }
  }
});
