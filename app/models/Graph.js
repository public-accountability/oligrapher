import Node from './Node';
import Edge from './Edge';
import Caption from './Caption';
import Helpers from './Helpers';
import merge from 'lodash/object/merge';
import assign from 'lodash/object/assign';
import values from 'lodash/object/values';
import intersection from 'lodash/array/intersection';
import flatten from 'lodash/array/flatten';
import cloneDeep from 'lodash/lang/cloneDeep';
import omit from 'lodash/object/omit';
import difference from 'lodash/array/difference';
import compact from 'lodash/array/compact';
import size from 'lodash/collection/size';
import includes from 'lodash/collection/includes';
import isNumber from 'lodash/lang/isNumber';
import Springy from "springy";

class Graph {
  static defaults() {
    return {
      nodes: {},
      edges: {},
      captions: {}
    };
  }

  static setDefaults(graph) {
    return merge({}, this.defaults(), graph);
  }

  static hasContent(graph) {
    return (values(graph.nodes).length + values(graph.edges).length + values(graph.captions).length) > 0;
  }

  // PREPARE DATA DURING LOAD

  static prepare(graph, layout = 'forceLayout') {
    return this.prepareCaptions(
      this.prepareEdges(
        this.prepareNodes(
          this.prepareLayout(
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

    // set defaults
    let newGraph = merge({}, graph, { 
      captions: values(graph.captions).reduce((result, caption) => {
        return merge({}, result, { [caption.id]: Caption.setDefaults(caption) });
      }, {})
    });

    return merge({}, newGraph, { captions });
  }

  static prepareEdges(graph, edges) {
    edges = edges || values(graph.edges);

    return merge({}, graph, { 
      edges: edges.reduce((result, edge) => { 
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

  static circleLayout(graph, allNodes = false) {
    let nodes = allNodes ? values(graph.nodes) : values(graph.nodes).filter(n => !Node.hasPosition(n));
    let radius = Math.pow(nodes.length * 70, 0.85);

    return merge({}, graph, { nodes: this.arrangeNodesInCircle(nodes, 0, 0, radius) });
  }

  static arrangeNodesInCircle(nodes, x, y, radius) {
    return values(nodes).reduce((result, node, i) => {
      let angle = (2 * Math.PI) * (i / values(nodes).length);
      return merge({}, result, { 
        [node.id]: merge({}, node, { display: { 
          x: x + Math.cos(angle) * radius, 
          y: y + Math.sin(angle) * radius 
        } }) 
      });
    }, {});    
  }

  static forceLayout(graph, steps = 500) {
    // only use force layout if there are unpositioned nodes
    if (!values(graph.nodes).find(n => !(isNumber(n.display.x) && isNumber(n.display.y)))) {
      return graph;
    }

    let layout = this.buildForceLayout(graph);
    let nodeCount = Object.keys(graph.nodes).length;
    let edgeCount = Object.keys(graph.edges).length

    steps = Math.round(steps / ((nodeCount + edgeCount) / 50));

    for (var i = 0; i < steps; i++) {
      layout.tick(0.01);
    }

    let newGraph = cloneDeep(graph);

    layout.eachNode((node, point) => {
      newGraph.nodes[node.data.label].display.x = point.p.x * 100;
      newGraph.nodes[node.data.label].display.y = point.p.y * 100;
    });

    // remove curve control points so that they're recalculated
    Object.keys(newGraph.edges).forEach(id => {
      delete newGraph.edges[id].display.cx;
      delete newGraph.edges[id].display.cy;
    });

    return newGraph;
  }

  static buildForceLayout(graph) {
    let gr = new Springy.Graph();

    let nodeIds = Object.keys(graph.nodes);
    let edges = values(graph.edges).map(e => [e.node1_id, e.node2_id]);

    gr.addNodes(...nodeIds);
    gr.addEdges(...edges);

    let stiffness = 200.0;
    let repulsion = 300.0;
    let damping = 0.5;
    let minEnergyThreshold = 0.1;

    return new Springy.Layout.ForceDirected(gr, stiffness, repulsion, damping, minEnergyThreshold);    
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

  // CONTENT UPDATING API

  static moveNode(graph, nodeId, x, y) {
    let edges = this.edgesConnectedToNode(graph, nodeId);

    // update the node
    graph = merge({}, graph, { nodes: { [nodeId]: { display: { x, y } } } });

    // then update the edges
    return merge({}, graph, { edges: edges.reduce((result, edge) => {
      let nodeNum = edge.node1_id == nodeId ? 1 : 2;
      let newEdge = this.moveEdgeNode(edge, nodeNum, x, y);
      return merge({}, result, { [edge.id]: this.updateEdgePosition(newEdge, graph) });
    }, {}) });
  }

  static moveEdge(graph, edgeId, cx, cy) {
    return this.updateEdge(graph, edgeId, { display: { cx, cy } });
  }

  static moveCaption(graph, captionId, x, y) {
    return this.updateCaption(graph, captionId, { display: { x, y } });
  }

  static swapNodeHighlight(graph, nodeId, singleSelect = false) {
    let oldStatus = graph.nodes[nodeId].display.status;
    let status = (oldStatus == "highlighted" ? "normal" : "highlighted");
    let newGraph = singleSelect ? this._deselectAll(graph) : graph;
    return this.updateNode(newGraph, nodeId, { display: { status } });
  }

  static swapEdgeHighlight(graph, edgeId, singleSelect = false) {
    let oldStatus = graph.edges[edgeId].display.status;
    let status = (oldStatus == "highlighted" ? "normal" : "highlighted");
    graph = singleSelect ? this._deselectAll(graph) : graph;
    return this.updateEdge(graph, edgeId, { display: { status } });
  }

  static swapCaptionHighlight(graph, captionId, singleSelect = false) {
    let oldStatus = graph.captions[captionId].display.status;
    let status = (oldStatus == "highlighted" ? "normal" : "highlighted");
    graph = singleSelect ? this._deselectAll(graph) : graph;
    return this.updateCaption(graph, captionId, { display: { status } });
  }

  static _deselectAll(graph) {
    let nodes = values(graph.nodes).reduce((result, node) => {
      result[node.id] = merge({}, node, { display: { status: "normal" } });
      return result;
    }, {});

    let edges = values(graph.edges).reduce((result, edge) => {
      result[edge.id] = merge({}, edge, { display: { status: "normal" } });
      return result;
    }, {});

    return merge({}, graph, { nodes: nodes, edges: edges });
  }

  // CONTENT CREATION API

  static addNode(graph, node) {
    node = merge({}, Node.setDefaults(node), { display: { x: 0, y: 0 } });
    return merge({}, graph, { nodes: { [node.id]: node } });
  }

  static addEdge(graph, edge) {
    edge = this.updateEdgePosition(Edge.setDefaults(edge), graph);
    return merge({}, graph, { edges: { [edge.id]: edge } });
  }

  static addCaption(graph, caption) {
    caption = Caption.setDefaults(caption);
    return merge({}, graph, { captions: { [caption.id]: caption } });
  }

  static addSurroundingNodes(graph, centerId, nodes) {
    let preparedNodes = nodes.map(n => Node.setDefaults(n));
    let centerNode = graph.nodes[centerId];
    let x = centerNode.display.x ? centerNode.display.x : 0;
    let y = centerNode.display.y ? centerNode.display.y : 0;
    let radius = Math.max(150, (nodes.length * 150) / (2 * Math.PI));
    let newNodes = this.arrangeNodesInCircle(preparedNodes, x, y, radius);
    return merge({}, graph, { nodes: newNodes });
  }

  static addInterlocks(graph, node1Id, node2Id, data) {
    let nodes = data.nodes;
    let edges = data.edges;

    let n1 = graph.nodes[node1Id];
    let n2 = graph.nodes[node2Id];
    let x1 = n1.display.x;
    let y1 = n1.display.y;
    let x2 = n2.display.x;
    let y2 = n2.display.y;

    let midX = (x1 + x2)/2;  
    let midY = (y1 + y2)/2;
    let angle = Math.atan2(x1 - x2, y2 - y1);
    let num = Object.keys(nodes).length;
    let spacing = Math.max(50, 200 - (num * 10));

    nodes = nodes.reduce((result, node, i) => {
      node.display.x = midX + Math.cos(angle) * (-(num-1)*spacing/2 + i*spacing);
      node.display.y = midY + Math.sin(angle) * (-(num-1)*spacing/2 + i*spacing)
      assign(result, { [node.id]: Node.setDefaults(node) });
      return result;
    }, {});

    let graphWithNodes = merge({}, graph, { nodes });

    edges.forEach((edge, i) => {
      graphWithNodes = this.addEdge(graphWithNodes, edge);
    });

    return graphWithNodes;
  }

  // CONTENT DELETION API

  static deleteNode(graph, nodeId) {
    let newGraph = merge({}, graph);
    let edges = this.edgesConnectedToNode(graph, nodeId);

    delete newGraph.nodes[nodeId];
    edges.forEach(edge => delete newGraph.edges[edge.id]);

    return newGraph;
  }

  static deleteEdge(graph, edgeId) {
    let newGraph = cloneDeep(graph);

    delete newGraph.edges[edgeId];

    return newGraph;
  }

  static deleteCaption(graph, captionId) {
    let newGraph = cloneDeep(graph);

    delete newGraph.captions[captionId];

    return newGraph;
  }

  static deleteNodes(graph, nodeIds) {
    let newGraph = cloneDeep(graph);
    let edgeIds = flatten(nodeIds.map(id => this.edgesConnectedToNode(graph, id).map(edge => edge.id)));

    edgeIds.forEach(id => delete newGraph.edges[id]);
    nodeIds.forEach(id => delete newGraph.nodes[id]);

    return newGraph;
  }

  static deleteEdges(graph, edgeIds) {
    let newGraph = cloneDeep(graph);

    edgeIds.forEach(id => delete newGraph.edges[id]);

    return newGraph;
  }

  static deleteCaptions(graph, captionIds) {
    let newGraph = cloneDeep(graph);

    captionIds.forEach(id => delete newGraph.captions[id]);

    return newGraph;
  }

  // BASIC UPDATERS

  static updateNode(graph, nodeId, data) {
    let node = Node.setDefaults(
      Helpers.compactObject(
        merge({}, graph.nodes[nodeId], omit(data, "id"))
      )
    );

    let nodes = assign({}, graph.nodes, { [nodeId]: node });

    return assign({}, graph, { nodes });
  }

  static updateEdge(graph, edgeId, data) {
    let edge = Edge.setDefaults(
      Helpers.compactObject(
        merge({}, graph.edges[edgeId], omit(data, "id"))
      )
    );

    let edges = assign({}, graph.edges, { [edgeId]: edge });

    return assign({}, graph, { edges });
  }

  static updateCaption(graph, captionId, data) {
    let caption = Caption.setDefaults(
      Helpers.compactObject(
        merge({}, graph.captions[captionId], omit(data, "id"))
      )
    );

    let captions = assign({}, graph.captions, { [captionId]: caption });

    return assign({}, graph, { captions });
  }

  // GRAPH FILTERS

  // removes unconnected nodes
  static prune(graph) {
    let newGraph = cloneDeep(graph);
    let connectedNodeIds = flatten(values(newGraph.edges).map(edge => [edge.node1_id, edge.node2_id]));
    let orphanNodeIds = difference(Object.keys(newGraph.nodes).map(nodeId => parseInt(nodeId)), connectedNodeIds);
    orphanNodeIds.forEach(nodeId => delete newGraph.nodes[nodeId]);
    return newGraph;
  }

  static highlightedOnly(graph) {
    let nodes = values(graph.nodes)
      .filter(node => node.display.status == "highlighted")
      .reduce((result, node) => {
        result[node.id] = node;
        return result;
      }, {});

    let edges = values(graph.edges)
      .filter(edge => edge.display.status == "highlighted")
      .reduce((result, edge) => {
        result[edge.id] = edge;
        return result;
      }, {});

    let captions = values(graph.captions)
      .filter(caption => caption.display.status == "highlighted")
      .reduce((result, caption) => {
        result[caption.id] = caption;
        return result;
      }, {});

    return { nodes, edges, captions };
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
    let filteredGraph = cloneDeep(graph);

    filteredGraph.nodes = nodeIds.reduce((result, nodeId) => merge(result, { [nodeId]: graph.nodes[nodeId] }), {});
    filteredGraph.edges = this.edgesBetweenNodes(graph, nodeIds)
                              .reduce((result, edge) => merge(result, { [edge.id]: edge }), {});

    return filteredGraph;
  }

  // HIGHLIGHTING

  static setHighlights(graph, highlights, otherwiseFaded = false) {
    if (highlights.nodeIds.length + highlights.edgeIds.length + highlights.captionIds.length == 0) {
      otherwiseFaded = false;
    }

    let { nodeIds, edgeIds, captionIds } = highlights;
    let otherwise = otherwiseFaded ? "faded" : "normal";
    let newGraph = cloneDeep(graph);

    // cast all ids to strings
    nodeIds = nodeIds.map(id => String(id));
    edgeIds = edgeIds.map(id => String(id));
    captionIds = captionIds.map(id => String(id));

    values(newGraph.nodes).forEach(node => {
      newGraph.nodes[node.id].display.status = includes(nodeIds, String(node.id)) ? "highlighted" : otherwise;
    });

    values(newGraph.edges).forEach(edge => {
      newGraph.edges[edge.id].display.status = includes(edgeIds, String(edge.id)) ? "highlighted" : otherwise;
    });

    values(newGraph.captions).forEach(caption => {
      newGraph.captions[caption.id].display.status = includes(captionIds, String(caption.id)) ? "highlighted" : otherwise;
    });

    return newGraph;
  };

  static clearHighlights(graph) {
    let newGraph = cloneDeep(graph);

    values(newGraph.nodes).forEach(node => {
      delete newGraph.nodes[node.id].display.status;
    });

    values(newGraph.edges).forEach(edge => {
      delete newGraph.edges[edge.id].display.status;
    });

    values(newGraph.captions).forEach(caption => {
      delete newGraph.captions[caption.id].display.status;
    });    

    return newGraph;
  }

  // ETC

  // groups multiple edges between the same nodes (regardless of direction) into one edge
  static bundleEdges(graph) {
    let edges = values(graph.edges).reduce((result, edge) => {
      let idHash = [edge.node1_id, edge.node2_id].sort()[0].toString() + ":" + 
                   [edge.node1_id, edge.node2_id].sort()[1].toString();
      result[idHash] = edge; // Edge.combine(edge, result[idHash]);
      return result;
    }, {});

    let bundledGraph = cloneDeep(graph);
    bundledGraph.edges = values(edges).reduce((result, edge) => merge(result, { [edge.id]: edge }), {});

    return bundledGraph;
  }

  static calculateCenter(graph) {
    if (size(graph.nodes) == 0) {
      return { x: 0, y: 0 };
    }

    let nodes = values(graph.nodes);
    let xs = compact(nodes.map(i => i.display.x));
    let ys = compact(nodes.map(i => i.display.y));

    return { x: xs.reduce((a, b) => a + b, 0)/xs.length, y: ys.reduce((a, b) => a + b, 0)/ys.length };
  }

  static recenter(graph) {
    let center = this.calculateCenter(graph);

    // don't recenter tiny amounts
    if (center.x < 10 && center.y < 10) {
      return graph;
    }

    let nodes = values(graph.nodes)
      .map(node => merge({}, node, { display: { 
        x: node.display.x - center.x,
        y: node.display.y - center.y 
      } })).reduce((result, node) => {
        result[node.id] = node;
        return result;
      }, {});

    return Graph.prepareEdges(merge({}, graph, { nodes }));
  }

  static calculateMaxRadiusFromCenter(graph) {
    if (size(graph.nodes) == 0) {
      return 0;
    }

    let center = this.calculateCenter(graph);
    let nodes = values(graph.nodes).filter(n => Node.hasPosition(n));
    let dists = nodes.map(i => 
      Math.sqrt(Math.pow(i.display.x - center.x, 2) + Math.pow(i.display.y - center.y, 2))
    );

    return Math.max.apply(null, dists);
  }

  static calculateEdgeAngle(edge) {
    let { x1, y1, x2, y2 } = edge.display;
    return Math.atan2(y2 - y1, x2 - x1);
  }

  static moveEdgeNode(edge, nodeNum, x, y) {
    let angle = this.calculateEdgeAngle(edge);
    let newEdge = merge({}, edge, { display: (nodeNum == 1 ? { x1: x, y1: y } : { x2: x, y2: y }) });
    let newAngle = this.calculateEdgeAngle(newEdge);
    let deltaAngle = newAngle - angle;
    let rotatedPoint = this.rotatePoint(edge.display.cx, edge.display.cy, deltaAngle);
    return merge(newEdge, { display: { cx: rotatedPoint.x, cy: rotatedPoint.y } });
  }

  static rotatePoint(x, y, angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return { x: x * cos - y * sin, y: x * sin + y * cos };
  }
}

module.exports = Graph;
