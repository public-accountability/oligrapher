var BaseComponent = require('./BaseComponent');
var Node = require('./Node.jsx');
var Edge = require('./Edge.jsx');
var imm = require("immutable");

class Graph extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Graph';
  }
  render(){
    var nodes = this.props.graph.nodes.map(n => <Node node={n} handleDrag={this.props.handleNodeDrag} />);
    var edges = this.props.graph.edges.map(e => <Edge edge={e} />);
    return (
      <svg className="Graph" width="1000" height="1000">
        {nodes}
        {edges}
      </svg>
    );
  }
}

module.exports = Graph;
