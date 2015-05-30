const BaseComponent = require('./BaseComponent');
const Node = require('./Node');
const Edge = require('./Edge');
const Marty = require('marty');

class Graph extends BaseComponent {
  render(){
    const nodes = this.props.graph.nodes.map(n =>
      <Node
        node={n}
        handleDrag={this.props.handleNodeDrag} />);  //TODO: use GraphActions.handleNodeDrag here
    const edges = this.props.graph.edges.map(e =>
      <Edge edge={e} />);
    return (
      <svg className="Graph" width="1000" height="1000">
        <g transform="translate(500, 500)">
          {edges}
          {nodes}
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
