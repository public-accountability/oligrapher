jest.dontMock('../Graph'); 
jest.dontMock('../Node'); 
jest.dontMock('../Edge'); 
jest.dontMock('../Helpers');

const Graph = require('../Graph'); 
const Edge = require('../Edge'); 
const { merge, values } = require('lodash');

describe("Graph", () => {

  const basicGraph = {
    id: "someid",
    nodes: {
      1: { id: 1, display: { name: "Node 1" } },
      2: { id: 2, display: { name: "Node 2" } },
      3: { id: 3, display: { name: "Node 3" } }
    },
    edges: {
      1: { id: 1, node1_id: 1, node2_id: 2, display: { label: "Edge 1" } },
      2: { id: 2, node1_id: 2, node2_id: 3, display: { label: "Edge 1" } }
    },
    captions: {
      1: { id: 1, display: { text: "Caption 1"} }
    }
  };

  describe("setDefaults", () => {

    it("gives a graph a string id if it doesn't have one", () => { 
      let graphWithDefaults = Graph.setDefaults(basicGraph);

      expect(graphWithDefaults.id).toEqual(jasmine.any(String));
    }); 

    it("doesn't change a graph if it has an id", () => { 
      let graphWithId = merge({}, basicGraph, { id: "someid" });
      let graphWithDefaults = Graph.setDefaults(graphWithId);

      expect(graphWithDefaults).toEqual(graphWithId);
    }); 
  });

  describe("prepareNodes", () => {

    const graph2 = Graph.prepareNodes(basicGraph);

    it("sets defaults for each node", () => {
      let scales = values(graph2.nodes).map(n => n.display.scale);
      let statuses = values(graph2.nodes).map(n => n.display.status);

      expect(scales).toBeAraryOfNumbers;
      expect(statuses).toBeArrayOfStrings;
    });

    it("doesn't add or remove nodes", () => {
      let ids = Object.keys(basicGraph.nodes);
      let ids2 = Object.keys(graph2.nodes);

      expect(ids).toEqual(ids2);
    });
  });

  describe("prepareLayout", () => {

    const graph2 = Graph.prepareLayout(basicGraph, 'circleLayout');

    it("gives nodes x and y coordinates", () => {
      let xs = values(graph2.nodes).map(n => n.display.x);
      let ys = values(graph2.nodes).map(n => n.display.y);

      expect(xs).toBeArrayOfNumbers;
      expect(ys).toBeArrayOfNumbers;
    });

    it("doesn't arrange nodes with existing coordinates", () => {
      let x2s = values(graph2.nodes).map(n => n.display.x);
      let y2s = values(graph2.nodes).map(n => n.display.y);

      let graph3 = Graph.prepareLayout(graph2, 'forceLayout');
      let x3s = values(graph3.nodes).map(n => n.display.x);
      let y3s = values(graph3.nodes).map(n => n.display.y);

      expect(x2s).toEqual(x3s);
      expect(y2s).toEqual(y3s);
    });
  });

  describe("updateEdgePosition", () => {

    const graph2 = Graph.prepareLayout(basicGraph, 'circleLayout');
    const edge = graph2.edges[1];
    console.log(edge);
    const edge2 = Graph.updateEdgePosition(edge, graph2);

    it("gives an edge data about its nodes", () => {
      let node1 = graph2.nodes[edge2.node1_id];
      let node2 = graph2.nodes[edge2.node2_id];

      expect(edge2.display.x1).toBe(node1.display.x);
      expect(edge2.display.y1).toBe(node1.display.y);
      expect(edge2.display.x2).toBe(node2.display.x);
      expect(edge2.display.y2).toBe(node2.display.y);
      expect(edge2.display.s1).toBe(node1.display.scale);
      expect(edge2.display.s2).toBe(node2.display.scale);
    });
  });

  describe("prepareEdges", () => {
    const graph2 = Graph.prepareLayout(Graph.prepareNodes(basicGraph), 'circleLayout');
    const graph3 = Graph.prepareEdges(graph2);

    it("updates all edge positions", () => {
      let edges2 = values(graph2.edges);
      let updatedEdges2 = edges2.map(e => Graph.updateEdgePosition(Edge.setDefaults(e), graph2));
      let edges3 = values(graph3.edges);

      expect(updatedEdges2).toEqual(edges3);
    });
  });

  describe("prepareCaptions", () => {

    it("gives coordinates to each unpositioned caption", () => {
      let graph2 = Graph.prepareCaptions(Graph.prepareLayout(basicGraph, 'circleLayout'));
      let xs = values(graph2.captions).map(c => c.display.x);
      let ys = values(graph2.captions).map(c => c.display.y);

      expect(xs).toBeArrayOfNumbers;
      expect(ys).toBeArrayOfNumbers;
    });

    it("doesn't alter already-positioned cpations", () => {
      let graph2 = merge({}, basicGraph, { captions: { 1: { display: { x: -100, y: -100 } } } });
      let graph3 = Graph.prepareCaptions(Graph.prepareLayout(graph2, 'circleLayout'));

      expect(graph2.captions[1]).toEqual(graph3.captions[1]);
    });
  });
});