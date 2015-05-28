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

  connect(id1, id2, content={}){
    var n1 = this.nodes.get(id1);
    var n2 = this.nodes.get(id2);

    n1.adj.add(n2);
    n2.adj.add(n2);

    var edge = new Edge({ n1: n1, n2: n2, content: content});
    this.edges = this.edges.set(edge.id, edge);

    return this;
  }

  moveNode(id, position){
    var n = this.nodes.get(id);
    n.x = position.left;
    n.y = position.top;
    return this;
  }

  // { entities: Array[Entityable], rels: Array[Relationship], text: Hash[str,pos] }
  importMap(data){
    data.entities.forEach(e => this.addNode(new Node({entity: e})));
  }

}

module.exports = Graph;
