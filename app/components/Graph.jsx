const BaseComponent = require('./BaseComponent');
const Node = require('./Node');
const Edge = require('./Edge');
const Marty = require('marty');

class Graph extends BaseComponent {
  render(){
    let markers = `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5"></path></marker>`;

    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" className="Graph" width='100%' height='100%'>
        <defs dangerouslySetInnerHTML={ { __html: markers } }/>
        <g transform="translate(600, 600)">
          { this.props.graph.edges.map(e =>
              <Edge edge={e} />) }
          { this.props.graph.nodes.map(n =>
              <Node node={n} />) }
        </g>
      </svg>
    );
  }
}

module.exports = Marty.createContainer(Graph, {
  listenTo: ['graphStore'],
  fetch: {
    graph() {
      return this.app.graphStore.state.graph;
    }
  }
});
