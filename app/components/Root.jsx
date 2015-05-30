var BaseComponent = require('./BaseComponent');
var GraphContainer = require('./GraphContainer');
var SearchContainer = require('./SearchContainer');
var lsApi = require('../api/lsApi');
var Graph = require('../models/Graph');
var mapData = require('../../test/support/sampleData').mitchellMap;
var converter = require('../models/Converter');

/* Root
   |- SearchContainer
   |--- SearchForm
   |--- SearchResults
   |----- SearchResult
   |- GraphContainer
   |--- Graph
   |----- Nodes
   |------- Node */

class Root extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Container';
    this.state = {
      graph: new Graph({}).importMap(mapData),
      results: [],
      query: null };
    this.bindAll('addNode', 'handleMapImport', 'handleNodeDrag');
  }
  addNode(entity){
    var node1 = converter.entityToNode(entity);
    this.setState({
      graph: this.state.graph.addNode(node1),
      results: []
    });
  }
  handleNodeDrag(id, position){
    this.setState({
      graph: this.state.graph.moveNode(id, position)
    });
  }
  handleMapImport(mapData){
    this.setState( { graph: this.state.graph.importMap(mapData) });
  }
  render(){
    return (
      <div className="container">
        <h1>Show Me The Money!</h1>
        <div class="row">
          <GraphContainer
            graph={this.state.graph}
            handleNodeDrag={this.handleNodeDrag} />
          <SearchContainer
            addNode={this.addNode}
          />
        </div>
      </div>
    );
  }
}

module.exports = Root;
