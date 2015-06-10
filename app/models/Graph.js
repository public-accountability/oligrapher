const Immutable = require('immutable');
const Node = require('./Node');
const Edge = require('./Edge');
const converter = require('./Converter');
const helpers = require('./helpers/GraphHelpers');
const _ = require('lodash');

class Graph {
  //constructor(GraphSpecs) -> Graph
  constructor(specs){
    this.id = specs.id || helpers.generateId();
    this.nodes = specs.nodes || Immutable.Map();
    this.edges = specs.edges || Immutable.Map();
    this.display = _.assign({ shrinkFactor: 1.2 }, specs.display);
  }

  isNull() {
    return this.id === -1;
  }

  addNode(node){
    this.nodes = this.nodes.set(node.id, node);
    return this;
  }

  edgesWithNode(id){
    return this.edges.filter(function(edge) {
      return edge.n1.id === id || edge.n2.id === id;
    });
  };

  connectNodes(id1, id2, specs={}){
    var n1 = this.nodes.get(id1);
    var n2 = this.nodes.get(id2);

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
    });
    return this;
  }

  moveEdge(id, x, y, cx, cy){
    var e = this.edges.get(id);
    e.display.x = x;
    e.display.y = y;
    e.display.cx = cx;
    e.display.cy = cy;
    e.updatePosition();
    return this;
  }

  addCaption(caption) {
    this.display.captions = _.assign({}, this.display.captions, { [caption.id]: caption });
    return this;
  }

  computeWidth() {
    if (this.nodes.count()) {
      const xs = this.nodes.toArray().map(n => n.display.x);
      return _.max(xs) - _.min(xs);
    } else {
      return 0;
    }
  }

  computeHeight() {
    if (this.nodes.count()) {
      const ys = this.nodes.toArray().map(n => n.display.y);
      return _.max(ys) - _.min(ys);
    } else {
      return 0;
    }
  }

  setShrinkFactor(factor) {
    this.display.shrinkFactor = factor;
    return this;
  }

  static parseMap(specs){
    return new Graph({})
      ._importBase(specs)
      .importEntities(specs.entities)
      .importRels(specs.rels)
      .importCaptions(specs.texts)
      ._convertCurves();
  }

  _importBase(map) {
    this.id = map.id;
    this.display.title = map.title;
    this.display.description = map.description;

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
      );
    });

    return this;
  }

  importCaptions(captions) {
    let that = this;
    if (captions) {
      captions.forEach(function(t) {
        that.addCaption(t)
      });
    }

    return this;
  }

  _convertCurves() {
    this.edges.forEach(e => {
      // convert control point from relative to absolute
      if (e.display.cx != null && e.display.cy != null) {
        let ax = (e.n1.display.x + e.n2.display.x) / 2;
        let ay = (e.n1.display.y + e.n2.display.y) / 2;
        e.display.cx += ax;
        e.display.cy += ay;
      }

      e.updatePosition();
      this.edges.set(e.id, e);
    });

    return this;
  }
}

module.exports = Graph;
