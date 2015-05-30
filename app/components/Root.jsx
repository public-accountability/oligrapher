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
    this.bindAll('handleNodeDrag');
  }
  handleNodeDrag(id, position){ //TODO: move this to GraphActions
    this.setState({
      graph: this.state.graph.moveNode(id, position)
    });
  }
  render(){
    return (
      <div className="container">
      <h1>Show Me The Money!</h1>
      <div class="row">
          <GraphContainer
            handleNodeDrag={this.handleNodeDrag} />
          <SearchContainer
          />
        </div>
      </div>
    );
  }
}

module.exports = Root;
