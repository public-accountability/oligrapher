const Immutable = require('immutable');
const Node = require('./Node');
const Edge = require('./Edge');
const converter = require('./Converter');
const helpers = require('./helpers/GraphHelpers');

class Graph {
  //constructor(GraphSpecs) -> Graph
  constructor(specs){
    this.id = specs.id || helpers.generateId();
    this.nodes = specs.nodes || Immutable.Map();
    this.edges = specs.edges || Immutable.Map();
  }

  addNode(node){
    this.nodes = this.nodes.set(node.id, node);
    return this;
  }

  connectNodes(id1, id2, specs={}){
    var n1 = this.nodes.get(id1);
    var n2 = this.nodes.get(id2);

    // n1.adj.add(n2);
    // n2.adj.add(n1);

    var edge = new Edge({
      n1: n1,
      n2: n2,
      content: specs.content,
      display: specs.display});

    this.edges = this.edges.set(edge.id, edge);

    return this;
  }

  moveNode(id, position){
    var n = this.nodes.get(id);
    n.display.x = position.left;
    n.display.y = position.top;
    return this;
  }

  // { entities: Array[Entityable], rels: Array[Relationship], text: Hash[str,pos] }p
  importMap(data){

    data.entities.forEach(
      e => this.addNode(converter.entityToNode(e)));

    data.rels.forEach(
      r => this.connectNodes(
        r.entity1_id,
        r.entity2_id,
        converter.relToEdgeSpecs(r)));

    return this;
  }

}

module.exports = Graph;
