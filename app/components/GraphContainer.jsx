var BaseComponent = require('./BaseComponent');
var Nodes = require('./Nodes');

class GraphContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'GraphContainer';
  }
  render(){
    return (
      <div className="graphContainer">
        <Nodes nodes={this.props.nodes} />
      </div>
    );
  }
}

module.exports = GraphContainer;
