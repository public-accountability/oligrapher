var React = require('react');
var BaseComponent = require('./components/BaseComponent');
var GraphContainer = require('./components/GraphContainer');
var SearchContainer = require('./components/SearchContainer');
var _ = require('lodash');
var lsApi = require('./api/lsApi');
var Node = require('./models/Node');
var imm = require('immutable');

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
    this.displayName = 'Main';
    this.state = { nodes: [], results: [], query: null };
    this.bindAll('handleSearchSubmit', 'addNode');
  }
  handleSearchSubmit(query){
    var that = this;
    lsApi.searchEntities(query).then(
      (res) => that.setState({results: res}),
      (err) => console.error(JSON.stringify(err))
    );
  }
  addNode(entity){
    var node = new Node(entity);
    var newState = _.assign( this.state, {
      nodes: this.state.nodes.concat([node]),
      results: []
    });
    this.setState(newState);
  }
  render(){
    return (
      <div className="container">
        <h1>Show Me The Money!</h1>
        <div class="row">
          <GraphContainer nodes={this.state.nodes}/>
          <SearchContainer
            query={this.query}
            results={this.state.results}
            addNode={this.addNode}
            handleSearchSubmit={this.handleSearchSubmit}
          />
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
