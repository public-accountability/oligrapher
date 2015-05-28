var Immutable = require('immutable');
var Node = require('./Node');
var Edge = require('./Edge');

class Graph {
  //constructor(Graphable) -> Graph
  constructor(graphable){
    this.nodes = graphable.nodes || Immutable.Map();
    this.edges = graphable.edges || Immutable.Map();    
  }

  addNode(node){
    this.nodes = this.nodes.set(node.id, node);
    return this;
  }

  connect(id1, id2){
    var node1 = this.nodes.get(id1);
    var node2 = this.nodes.get(id2);
    console.log('NODES', this.nodes);
    console.log('NODE 1', node1);
    console.log('NODE 2', node2);
    var edge = new Edge({ n1: node1, n2: node2 });
    this.edges = this.edges.set(edge.id, edge);

    //TODO:
    //add each node to each others' adjacency list

    return this;
  }

  moveNode(id, position){
    var node = this.nodes.get(id);
    console.log("moved node position", position);
    node.x = position.left;
    node.y = position.top;
    this.nodes.set(id, node);
    return this;
  }
}

module.exports = Graph;