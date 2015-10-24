const Node = require('./Node');
const Edge = require('./Edge');
const converter = require('./Converter');
const helpers = require('./helpers/GraphHelpers');
const _ = require('lodash');

class Graph {
  //constructor(GraphSpecs) -> Graph
  constructor(specs){
    this.id = specs.id || helpers.generateId();
    this.nodes = specs.nodes || {};
    this.edges = specs.edges || {};
    this.display = _.assign({ shrinkFactor: 1.3 }, specs.display);
  }

  isNull() {
    return this.id === -1;
  }

  addNode(node){
    this.nodes[node.id] = node;
    return this;
  }

  edgesWithNode(id){
    return _.values(this.edges).filter(function(edge) {
      return edge.n1.id === id || edge.n2.id === id;
    });
  };

  connectNodes(id1, id2, specs={}){
    const n1 = this.nodes[id1];
    const n2 = this.nodes[id2];

    const edge = new Edge({
      id: specs.id,
      n1: n1,
      n2: n2,
      content: specs.content,
      display: specs.display});

    this.edges[edge.id] = edge;

    return this;
  }

  moveNode(id, position){
    const n = this.nodes[id];
    n.display.x = position.left;
    n.display.y = position.top;
    this.edgesWithNode(id).forEach(function(edge) {
      edge.updatePosition();
    });
    return this;
  }

  moveEdge(id, x, y, cx, cy){
    var e = this.edges[id];
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
    if (_.keys(this.nodes).length > 0) {
      const xs = _.values(this.nodes).map(n => n.display.x);
      return _.max(xs) - _.min(xs);
    } else {
      return 0;
    }
  }

  computeHeight() {
    if (_.keys(this.nodes).length > 0) {
      const ys = _.values(this.nodes).map(n => n.display.y);
      return _.max(ys) - _.min(ys);
    } else {
      return 0;
    }
  }

  computeViewbox(highlightedOnly = true) {
    const nodes = _.values(this.nodes)
      .filter(n => !highlightedOnly || n.display.status != "faded")
      .map(n => ({ x: n.display.x, y: n.display.y }));
    // const edges = this.edges.toArray()
    //   .filter(e => e.display.status != "faded")
    //   .map(e => ({ x: e.display.cx, y: e.display.cy }));
    const items = nodes;

    if (items.length > 0) {
      const padding = highlightedOnly ? 50 : 0;
      const xs = items.map(i => i.x);
      const ys = items.map(i => i.y);
      const textPadding = 50; // node text might extend below node
      return { 
        x: _.min(xs) - padding, 
        y: _.min(ys) - padding, 
        w: _.max(xs) - _.min(xs) + padding * 2, 
        h: _.max(ys) - _.min(ys) + textPadding + padding
      };
    } else {
      return { x: 0, y: 0, w: 0, h: 0 };
    }
  }

  setShrinkFactor(factor) {
    this.display.shrinkFactor = factor;
    return this;
  }

  getNodeByEntityId(id) {
    return _.find(_.values(this.nodes), n => n.content.entity.id === id);
  }

  static importGraph(specs){
    return new Graph({})
      ._importBase(specs)
      .importNodes(specs.nodes)
      .importEdges(specs.edges)
      .positionNodes()
      ._convertCurves();
  }

  importNodes(nodes) {
    nodes.map(
      n => this.addNode(new Node(n))
    );

    return this;
  }

  importEdges(edges) {
    edges.map(e => {
      this.connectNodes(
        e.n1,
        e.n2,
        e
      );

    });

    return this;
  }

  // arranges nodes without layout in circle around origin
  positionNodes() {
    let ary = _.values(this.nodes).filter(n => !n.hasPosition());
    let radius = Math.pow(ary.length * 100, 0.85);

    ary.forEach((node, i) => {
      let angle = (2 * Math.PI) * (i / ary.length);
      node.display.x = Math.cos(angle) * radius;
      node.display.y = Math.sin(angle) * radius;
      // this.nodes[key].display.x = Math.round(Math.random() * 500) - 250;
      // this.nodes[key].display.y = Math.round(Math.random() * 500) - 250;
    });

    return this;
  }

  positionEdges() {
    Object.keys(this.edges).filter(edge => !edge.hasCurve()).map(key => {
      let edge = this.edges[key];

      edge.display.xa = edge.n1.display.x;
      edge.display.ya = edge.n1.display.y;
      edge.display.xb = edge.n2.display.x;
      edge.display.yb = edge.n2.display.y;
      edge.display.cx = (edge.n1.display.x + edge.n2.display.x) / 2;
      edge.display.cy = (edge.n1.display.y + edge.n2.display.y) / 2;        
    });

    return this;
  }

  static parseApiGraph(specs){
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
        this.getNodeByEntityId(r.entity1_id).id,
        this.getNodeByEntityId(r.entity2_id).id,
        specs
      );
    });

    return this;
  }

  importCaptions(captions) {
    const that = this;
    if (captions) {
      captions.forEach(function(t) {
        that.addCaption(t);
      });
    }

    return this;
  }

  _convertCurves() {
    _.values(this.edges).forEach(e => {
      // convert control point from relative to absolute
      if (e.display.cx != null && e.display.cy != null) {
        let ax = (e.n1.display.x + e.n2.display.x) / 2;
        let ay = (e.n1.display.y + e.n2.display.y) / 2;
        e.display.cx += ax;
        e.display.cy += ay;
      }

      e.updatePosition();
      this.edges[e.id] = e;
    });

    return this;
  }
}

module.exports = Graph;
