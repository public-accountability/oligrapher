const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Graph = require('./Graph');

class GraphContainer extends BaseComponent {
  render(){
    return (
      <div className="graphContainer">
        <Graph graph={this.props.graph}/>
      </div>
    );
  }
}

module.exports = Marty.createContainer(GraphContainer, {
  listenTo: ['graphStore'],
  fetch: {
    graph() {
      return this.app.graphStore.getCurrentGraph();
    }
  }
});
