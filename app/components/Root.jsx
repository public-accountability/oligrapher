var BaseComponent = require('./BaseComponent');
var GraphContainer = require('./GraphContainer');
var SearchContainer = require('./SearchContainer.jsx');
var lsApi = require('../api/lsApi.js');
var Graph = require('../models/Graph.jsx');
var mapData = require('../../test/support/sampleData.js').mitchellMap;
var converter = require('../models/Converter.js');

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
  }
  render(){
    return (
      <div className="container">
      <h1>Show Me The Money!</h1>
      <div class="row">
          <GraphContainer />
          <SearchContainer />
        </div>
      </div>
    );
  }
}

module.exports = Root;
