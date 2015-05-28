var Immutable = require('immutable');
var _ = require('lodash');

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
    this.id = this.entity.id || this.generateId();
    this.content = specs.content;
    this.adj = specs.adj || Immutable.Set();
    this.display = _.merge({}, defaults.display, specs.display);
  }
  generateId(){
    return `x${Math.random() * 1000000000000}`;
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
