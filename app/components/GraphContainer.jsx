import Marty from 'marty';
import BaseComponent from './BaseComponent';
import GraphZoomButtons from './GraphZoomButtons';
import Graph from './Graph';

class GraphContainer extends BaseComponent {
  render(){
    return (
      <div className="graphContainer">
        <GraphZoomButtons />
        <Graph graph={this.props.graph} />
      </div>
    );
  }
}

module.exports = Marty.createContainer(GraphContainer, {
  listenTo: ['deckStore'],
  fetch: {
    graph() {
      return this.app.graphStore.getGraph(this.app.deckStore.getCurrentGraphId());
    }
  }
});
