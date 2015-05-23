//var React = require('react');
var BaseComponent = require('./BaseComponent');
var Canvas = require('./Canvas');
var SearchContainer = require('./SearchContainer');
var _ = require('lodash');
var lsApi = require('../api/lsApi');

/* Container
   |- SearchContainer
   |--- SearchForm
   |--- SearchResults
   |----- SearchResult
   |- Container
   |--- Graph
   |----- Nodes
   |------- Node */


class Container extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Container';
    this.state = { nodes: [] };
    this.bindAll('handleSearchResultClick');
  }
  //handleSearchresultClick(Entity) -> Unit
  handleSearchResultClick(entity){
    nodes = lsApi.
    this.setState(_.assign(this.state, {nodes: this.state.nodes.push(new Node(entity))}));
  }
  render(){
    return (
      <div className="container">
        <h1>Show Me The Money!</h1>
        <div class="row">
          <Canvas />
          <SearchContainer />
        </div>
      </div>
    );
  }
}

module.exports = Container;
