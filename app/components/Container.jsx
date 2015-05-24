//var React = require('react');
var BaseComponent = require('./BaseComponent');
var GraphContainer = require('./GraphContainer');
var SearchContainer = require('./SearchContainer');
var _ = require('lodash');
var lsApi = require('../api/lsApi');
var Node = require('../models/Node');
var imm = require('immutable');

/* Container
   |- SearchContainer
   |--- SearchForm
   |--- SearchResults
   |----- SearchResult
   |- GraphContainer
   |--- Graph
   |----- Nodes
   |------- Node */


class Container extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Container';
    //this.state = imm.Map({ nodes: imm.List()});
    this.state = { nodes: []};
    this.bindAll('addNode');
  }
  addNode(entity){
    var node = new Node(entity);
    //var newState = imm.Map(this.state).update('nodes', (ns) => ns.push(entity));
    var newState = _.assign( this.state, {
      nodes: this.state.nodes.concat([node])});
    //debugger;
    this.setState(newState);
  }
  render(){
    return (
      <div className="container">
        <h1>Show Me The Money!</h1>
        <div class="row">
          <GraphContainer nodes={imm.Map(this.state).get('nodes')}/>
          <SearchContainer addNode={this.addNode}/>
        </div>
      </div>
    );
  }
}

module.exports = Container;
