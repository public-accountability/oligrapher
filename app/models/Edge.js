var Immutable = require('immutable');

class Edge {
  //constructor(Edgeable) -> Edge
  constructor(edgeable){
    this.n1 = edgeable.n1;
    this.n2 = edgeable.n2;    
    this.id = edgeable.id || this.generateId();
  }

  generateId(){
    return `x${Math.random() * 1000000000000}`;
  }
}

module.exports = Edge;

//Edgeable is a quasi-ADT
// variants include:
// Relationship
