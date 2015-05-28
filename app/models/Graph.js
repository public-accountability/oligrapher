var Immutable = require('immutable');
var Node = require('./Node');
var Edge = require('./Edge');

class Graph {
  //constructor(Graphable) -> Graph
  constructor(graphable){
    this.nodes = graphable.nodes || Immutable.Set();
    this.edges = graphable.edges || Immutable.Set();
  }

  addNode(node){
    this.nodes = this.nodes.add(node);
    return this;
  }

  // connect(id1, id2){
  //   var node1 = this.nodes.get(id1);
  //   var node2 = this.nodes.get(id2);
  //   var edge = new Edge({ n1: n1, n2: n2 });
  //   this.edges = this.edges.set(edge.id, edge);
  connect(n1, n2){
    n1.adj.add(n2);
    n2.adj.add(n1);
    this.edges = this.edges.add(new Edge({ n1: n1, n2: n2 }));
    return this;
  }

  // moveNode(id, position){
  //   var node = this.nodes.get(id);
  moveNode(node, position){
    node.x = position.left;
    node.y = position.top;
    return this;
  }
}

module.exports = Graph;
