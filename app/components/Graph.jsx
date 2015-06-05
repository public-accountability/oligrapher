const BaseComponent = require('./BaseComponent');
const Node = require('./Node');
const Edge = require('./Edge');
const Marty = require('marty');

class Graph extends BaseComponent {
  render(){
    return (
      <svg className="Graph" width='100%' height='100%'>
        <g transform="translate(500, 500)">
          { this.props.graph.edges.map(e =>
              <Edge key={e.id} edge={e} />) }
          { this.props.graph.nodes.map(n =>
              <Node key={n.id} node={n} />) }
        </g>
      </svg>
    );
  }
}

module.exports = Marty.createContainer(Graph);
