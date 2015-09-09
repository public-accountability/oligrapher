const React = require('react');
const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Graph = require('./Graph');
const DocMeta = require('react-doc-meta');

class GraphContainer extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_handleZoomIn', '_handleZoomOut');
  }

  render(){
    const tags = [
      { property: "og:title", content: this.props.deck.title + " - LittleSis" },
      { property: "og:image", content: "http://s3.amazonaws.com/pai-littlesis/images/maps/" + this.props.deck.id + ".png" }
    ];

    const zoomButtons = this.props.graph.isNull() ? null : (
      <div id="zoomButtons">
        <button id="zoom-in" className="zoomButton" onClick={this._handleZoomIn}>+</button>
        <button id="zoom-out" className="zoomButton" onClick={this._handleZoomOut}>&ndash;</button>
      </div>
    );

    return (
      <div className="graphContainer">
        <DocMeta tags={tags} />
        {zoomButtons}
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
    },
    deck() {
      return this.app.deckStore.getCurrentDeck();
    }
  }
});
