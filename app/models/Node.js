var Immutable = require('immutable');

class Node {
  //constructor(Nodable) -> Node
  constructor(nodable){
    this.entity = nodable.entity;
    this.id = this.entity.id || this.generateId();
    this.adj = Immutable.Set();
    this.x = nodable.x || 400;
    this.y = nodable.y || 400;
  }

  generateId(){
    return `x${Math.random() * 1000000000000}`;
  }
}

module.exports = Node;

//Nodable is a quasi-ADT
// variants include:
// Entity
