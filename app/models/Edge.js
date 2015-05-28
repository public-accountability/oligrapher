var Immutable = require('immutable');

class Edge {
  //constructor(EdgeSpecs) -> Edge
  constructor(specs){
    this.id = specs.id || this.generateId();
    this.n1 = specs.n1;
    this.n2 = specs.n2;
    this.content = specs.content || {};
    this.display = specs.display || {};
  }

  generateId(){
    return `x${Math.random() * 1000000000000}`;
  }
}

module.exports = Edge;

// EdgeSpecs
// {
//   id: Int,
//   n1: {},
//   n2: {}
//   content: {},
//   display: {},
// }
