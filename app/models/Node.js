const Immutable = require('immutable');
const helpers = require('./helpers/GraphHelpers');
const _ = require('lodash');

var defaults =  {
  display: {
    x: 100,
    y: 100,
    name: 'Node'
  }
};

class Node {
 //constructor(NodeSpecs) -> Node
  constructor(specs){
    this.id = specs.id || helpers.generateId();
    this.content = specs.content;
    this.adj = specs.adj || Immutable.Set();
    this.display = _.merge({}, defaults.display, specs.display);
  }
}

module.exports = Node;

//NodeSpecs
// {
//   id: Int,
//   adj: [],
//   content: {},
//   display: {}
// }
