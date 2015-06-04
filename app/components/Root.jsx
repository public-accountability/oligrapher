const BaseComponent = require('./BaseComponent');
const NavBar = require('./NavBar.jsx');
const GraphContainer = require('./GraphContainer');
const SearchContainer = require('./SearchContainer');
const lsApi = require('../api/lsApi.js');
const Graph = require('../models/Graph');
const mapData = require('../../test/support/sampleData.js').mitchellMap;
const converter = require('../models/Converter.js');

class Root extends BaseComponent {
  constructor(){
    super();
  }
  render() {
    return (
      <div className="root">
        <h1>Show Me The Money!</h1>
        <NavBar />
        <div class="row">
          <GraphContainer />
          <SearchContainer />
        </div>
      </div>
    );
  }
}

module.exports = Root;
