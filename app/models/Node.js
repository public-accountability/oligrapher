var Immutable = require('immutable');

class Node {
  //constructor(Nodable) -> Node
  constructor(nodable){
    this.item = nodable;
    this.adj = Immutable.Set();
  }
}

module.exports = Node;

//Nodable is a quasi-ADT
// variants include:
// Entity
