var BaseComponent = require('./BaseComponent');
var Graph = require('./Graph');

class GraphContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'GraphContainer';
  }
  render(){
    return (
      <div className="graphContainer">
        <Graph
      /* graph={this.props.graph} */
          handleNodeDrag={this.props.handleNodeDrag} />
      </div>
    );
  }
}

module.exports = GraphContainer;
