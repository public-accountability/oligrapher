var BaseComponent = require('./BaseComponent');
var Node = require('./Node.jsx');
var imm = require("immutable");

class Nodes extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Nodes';
  }
  render(){
    var nodes = this.props.nodes.map(n => <Node node={n} />);
    return (
      <div className="Nodes">
        {nodes}
      </div>
    );
  }
}

module.exports = Nodes;
