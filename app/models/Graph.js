import Node from './Node';
import Edge from './Edge';
import helpers from './Helpers';
import { merge, values, intersection } from 'lodash';
import Springy from 'springy';

class Graph {
  static generateId() {
    return helpers.generateId();
  }

  static defaults() {
    return {
      id: this.generateId()
    };
  }

  static setDefaults(graph) {
    return merge({}, this.defaults(), graph);
  }

  static prepare(graph, layout = 'forceLayout') {
    return this.prepareCaptions(
      this.prepareEdges(
        this.prepareLayout(
          this.prepareNodes(
            this.setDefaults(graph)
          ), layout)
      )
    );
  }

  static prepareCaptions(graph) {
    // list unpositioned captions on left side
    let ary = values(graph.captions).filter(c => !(c.display.x && c.display.y));
    let minX = Math.min(...values(graph.nodes).map(n => n.display.x));
    let minY = Math.min(...values(graph.nodes).map(n => n.display.y));

    let captions = ary.reduce((result, c, i) => {
      result[c.id] = merge({}, c, { display: { x: minX - 200, y: minY + (i * 50) } });
      return result;
    }, {});

    return merge({}, graph, { captions });
  }

  static prepareEdges(graph) {
    return merge({}, graph, { 
      edges: values(graph.edges).reduce((result, edge) => { 
        return merge({}, result, { [edge.id]: this.updateEdgePosition(Edge.setDefaults(edge), graph) });
      }, {}) 
    });
  }

  static prepareNodes(graph) {
    let nodes = values(graph.nodes).reduce((result, node) => {
      return merge({}, result, { [node.id]: Node.setDefaults(node) });
    }, {});

    return merge({}, graph, { nodes: nodes });
  }

  static prepareLayout(graph, layout = 'forceLayout') {
    return this[layout](graph);
  }

  static circleLayout(graph) {
    // arrange unpositioned nodes into a circle
    let ary = values(graph.nodes).filter(n => !(n.display.x && n.display.y));
    let radius = Math.pow(ary.length * 100, 0.85);

    return merge({}, graph, { nodes: ary.reduce((result, node, i) => {
      let angle = (2 * Math.PI) * (i / ary.length);
      return merge({}, result, { 
        [node.id]: { display: { 
          x: Math.cos(angle) * radius, 
          y: Math.sin(angle) * radius 
        } } 
      });
    }, {}) });    
  }

  static forceLayout(graph, steps = 500) {
    // only use force layout if there are unpositioned nodes
    if (!values(graph.nodes).find(n => !(n.display.x && n.display.y))) {
      return graph;
    }

    let gr = new Springy.Graph();

    let nodeIds = values(graph.nodes).map(n => n.id);
    let edges = values(graph.edges).map(e => [e.node1_id, e.node2_id]);

    gr.addNodes(...nodeIds);
    gr.addEdges(...edges);

    let stiffness = 200.0;
    let repulsion = 300.0;
    let damping = 0.5;
    let minEnergyThreshold = 0.1;

    let layout = new Springy.Layout.ForceDirected(gr, stiffness, repulsion, damping, minEnergyThreshold);
    
    steps = Math.round(steps / ((nodeIds.length + edges.length) / 50));

    for (var i = 0; i < steps; i++) {
      layout.tick(0.01);
    }

    let newGraph = merge({}, graph);

    layout.eachNode((node, point) => {
      newGraph.nodes[node.data.label].display.x = point.p.x * 100;
      newGraph.nodes[node.data.label].display.y = point.p.y * 100;
    });

    // remove curve control points so that they're recalculated
    values(newGraph.edges).forEach(e => {
      newGraph.edges[e.id].display.cx = null;
      newGraph.edges[e.id].display.cy = null;
    });

    return newGraph;
  }

  static updateEdgePosition(edge, graph) {
    // get nodes connected by edge
    let n1 = graph.nodes[edge.node1_id];
    let n2 = graph.nodes[edge.node2_id];

    return merge({}, edge, { display: { 
      x1: n1.display.x,
      y1: n1.display.y,
      x2: n2.display.x,
      y2: n2.display.y,
      s1: n1.display.scale,
      s2: n2.display.scale
    } });
  }

  static moveNode(graph, nodeId, x, y) {
    // first update the node
    graph = merge({}, graph, { nodes: { [nodeId]: { display: { x, y } } } });

    let edges = this.edgesConnectedToNode(graph, nodeId);

    // then update the edges
    return merge({}, graph, { edges: edges.reduce((result, edge) => {
      return merge({}, result, { [edge.id]: this.updateEdgePosition(edge, graph) });
    }, {}) });

  }

  static moveEdge(graph, edgeId, cx, cy) {
    return merge({}, graph, { edges: { [edgeId]: this.updateEdgePosition(merge({}, graph.edges[edgeId], { display: { cx, cy } }), graph) } });
  }

  static moveCaption(graph, captionId, x, y) {
    return merge({}, graph, { captions: { [captionId]: { display: { x, y } } } });
  }

  static edgesConnectedToNode(graph, nodeId) {
    return values(graph.edges).filter(edge => edge.node1_id == nodeId || edge.node2_id == nodeId);
  }

  static edgesBetweenNodes(graph, nodeIds) {
    return values(graph.edges).filter(edge => intersection([edge.node1_id, edge.node2_id], nodeIds).length == 2);
  }


  // FUNCTIONS FOR FILTERING LARGE GRAPHS

  static filterNodesByEdgeNum(graph, num = 2) {
    // count edges for each node
    let edgeCount = values(graph.edges).reduce((result, edge) => {
      result[edge.node1_id] = (result[edge.node1_id] || 0) + 1;
      result[edge.node2_id] = (result[edge.node2_id] || 0) + 1;
      return result;
    }, {});

    let nodeIds = Object.keys(edgeCount).filter(nodeId => edgeCount[nodeId] >= num);

    return this.limitGraphToNodeIds(graph, nodeIds);
  }

  static filterByConnectedness(graph, num = 20) {
    // count edges for each node
    let edgeCount = values(graph.edges).reduce((result, edge) => {
      result[edge.node1_id] = (result[edge.node1_id] || 0) + 1;
      result[edge.node2_id] = (result[edge.node2_id] || 0) + 1;
      return result;
    }, {});

    // order node ids by descending number of edges and keep num
    let nodeIds = Object.keys(edgeCount).sort((a, b) => edgeCount[b] - edgeCount[a]).slice(0, num);

    return this.limitGraphToNodeIds(graph, nodeIds);
  }

  // limits graph to set of nodes and the edges between them
  static limitGraphToNodeIds(graph, nodeIds) {
    let filteredGraph = merge({}, graph);

    filteredGraph.nodes = nodeIds.reduce((result, nodeId) => merge(result, { [nodeId]: graph.nodes[nodeId] }), {});
    filteredGraph.edges = this.edgesBetweenNodes(graph, nodeIds)
                              .reduce((result, edge) => merge(result, { [edge.id]: edge }), {});

    return filteredGraph;
  }

  // groups multiple edges between the same nodes (regardless of direction) into one edge
  static bundleEdges(graph) {
    let edges = values(graph.edges).reduce((result, edge) => {
      let idHash = [edge.node1_id, edge.node2_id].sort()[0].toString() + ":" + 
                   [edge.node1_id, edge.node2_id].sort()[1].toString();
      result[idHash] = edge; // Edge.combine(edge, result[idHash]);
      return result;
    }, {});

    let bundledGraph = merge({}, graph);
    bundledGraph.edges = values(edges).reduce((result, edge) => merge(result, { [edge.id]: edge }), {});

    return bundledGraph;
  }
}

module.exports = Graph;
