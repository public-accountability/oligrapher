var BaseComponent = require('./BaseComponent');
var Node = require('./Node');
var Edge = require('./Edge');
var imm = require("immutable");

class Graph extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Graph';
  }
  render(){
    var nodes = this.props.graph.nodes.map(n =>
      <Node
        node={n}
        handleDrag={this.props.handleNodeDrag} />);
     var edges = this.props.graph.edges.map(e =>
      <Edge edge={e} />);
    return (
      <svg className="Graph" width="1000" height="1000">
        {edges}
        {nodes}
      </svg>
    );
  }
}

module.exports = Graph;
