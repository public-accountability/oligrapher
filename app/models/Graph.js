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

  edgesWithNode(id){
    return this.edges.filter(function(edge) {
      return edge.n1.id == id || edge.n2.id == id;
    });
  };

  connectNodes(id1, id2, specs={}){
    var n1 = this.nodes.get(id1);
    var n2 = this.nodes.get(id2);

    // n1.adj.add(n2);
    // n2.adj.add(n1);

    var edge = new Edge({
      id: specs.id,
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
    this.edgesWithNode(id).forEach(function(edge) {
      edge.updatePosition();
    })
    return this;
  }

  moveEdge(id, x, y, cx, cy){
    var e = this.edges.get(id);
    e.display.x = x;
    e.display.y = y;
    e.display.cx = cx;
    e.display.cy = cy;
    return this;
  }

  // { entities: Array[Entityable], rels: Array[Relationship], text: Hash[str,pos] }p
  importMap(data){

    data.entities.forEach(
      e => this.addNode(converter.entityToNode(e))
    );

    data.rels.forEach((r) => {
      // convert control point from relative to absolute
      let specs = converter.relToEdgeSpecs(r);

      if (specs.display.cx != null && specs.display.cy != null){
        let n1 = this.nodes.get(specs.content.rel.entity1_id);
        let n2 = this.nodes.get(specs.content.rel.entity2_id);
        let ax = (n1.display.x + n2.display.x) / 2;
        let ay = (n1.display.y + n2.display.y) / 2;
        specs.display.cx += ax;
        specs.display.cy += ay;
      }

      this.connectNodes(
        r.entity1_id,
        r.entity2_id,
        specs
      )
    });

    return this;
  }

}

module.exports = Graph;
