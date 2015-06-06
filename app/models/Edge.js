const Immutable = require('immutable');
const helpers = require('./helpers/GraphHelpers');

class Edge {
  //constructor(EdgeSpecs) -> Edge
  constructor(specs){
    this.id = specs.id || helpers.generateId();
    this.n1 = specs.n1;
    this.n2 = specs.n2;
    this.content = specs.content || {};
    this.display = specs.display || {};
  }
}

module.exports = Edge;

// EdgeSpecs
// {
//   id: Int,
//   n1: {}, Node
//   n2: {}, Node
//   content: {},
//   display: {},
// }
