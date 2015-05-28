var React = require('react');
var BaseComponent = require('./components/BaseComponent');
var GraphContainer = require('./components/GraphContainer');
var SearchContainer = require('./components/SearchContainer');
var _ = require('lodash');
var lsApi = require('./api/lsApi');
var Node = require('./models/Node');
var Edge = require('./models/Edge');
var Graph = require('./models/Graph');
var imm = require('immutable');
var mapData = require('../test/support/sampleData').mitchellMap;
var converter = require('./models/Converter');

/* Main
   |- SearchContainer
   |--- SearchForm
   |--- SearchResults
   |----- SearchResult
   |- GraphContainer
   |--- Graph
   |----- Nodes
   |------- Node */

class Main extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Container';
    this.zero_node = new Node({
      id: 'xo',
      display: {
        name: 'Man Behind The Throne',
        x: 400,
        y: 400 }
    });
    this.state = {
      graph: new Graph({}).addNode(this.zero_node),
      results: [],
      query: null };
    this.bindAll('handleSearchSubmit', 'addNode', 'handleNodeDrag');
  }
  handleSearchSubmit(query){
    var that = this;
    lsApi.searchEntities(query).then(
      (res) => that.setState({results: res}),
      (err) => console.error(JSON.stringify(err))
    );
  }
  addNode(entity){
    var node1 = converter.entityToNode(entity);
    this.setState({
      graph: this.state.graph.addNode(node1).connect(node1.id, this.zero_node.id),
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
            query={this.query}
            results={this.state.results}
            addNode={this.addNode}
            handleSearchSubmit={this.handleSearchSubmit} />
        </div>
      </div>
    );
  }
}


React.render(
  <Main />,
  document.getElementById('content')
);

module.exports = Main;
