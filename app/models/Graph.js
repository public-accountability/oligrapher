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
    this.display = specs.display;
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
  static parseMap(specs){
    return new Graph({})
      ._importBase(specs)
      .importEntities(specs.entities)
      .importRels(specs.rels)
      ._convertCurves();
  }

  _importBase(map) {
    this.id = map.id;
    this.display = {
      title: map.title,
      description: map.description
    };

    return this;
  }

  importEntities(entities) {
    entities.map(
      e => this.addNode(converter.entityToNode(e))
    );

    return this;
  }

  importRels(rels) {
    rels.map((r) => {
      const specs = converter.relToEdgeSpecs(r);

      this.connectNodes(
        r.entity1_id,
        r.entity2_id,
        specs
      )
    });

    return this;
  }

  _convertCurves() {
    this.edges.forEach(r => {
      // convert control point from relative to absolute
      if (r.display.cx != null && r.display.cy != null){
        const ax = (r.n1.display.x + r.n2.display.x) / 2;
        const ay = (r.n1.display.y + r.n2.display.y) / 2;
        r.display.cx += ax;
        r.display.cy += ay;
      }
    });

    return this;
  }
}

module.exports = Graph;
