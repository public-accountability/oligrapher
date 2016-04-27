jest.unmock('../Graph');
jest.unmock('../Node');
jest.unmock('../Edge');
jest.unmock('../Caption');
jest.unmock('../Helpers');
jest.unmock('springy');

import Graph from '../Graph';
import Edge from '../Edge';
import Caption from '../Caption';
import merge from 'lodash/object/merge';
import values from 'lodash/object/values';
import uniq from 'lodash/array/uniq';
import range from 'lodash/utility/range';
import pick from 'lodash/object/pick';

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
      2: { id: 2, node1_id: 2, node2_id: 3, display: { label: "Edge 2" } }
    },
    captions: {
      1: { id: 1, display: { text: "Caption 1"} }
    }
  };

  const preparedGraph = Graph.prepare(basicGraph);

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

    it("gives nodes x and y coordinates", () => {
      let graph2 = Graph.prepareLayout(basicGraph);
      let xs = values(graph2.nodes).map(n => n.display.x);
      let ys = values(graph2.nodes).map(n => n.display.y);

      expect(xs).toBeArrayOfNumbers;
      expect(ys).toBeArrayOfNumbers;
    });
  });

  describe("circleLayout", () => {

    it("arranges nodes equidistant from the zero coordinates", () => {
      let graph2 = Graph.circleLayout(basicGraph, true);
      let roundedDists = values(graph2.nodes)
        .map(n => Math.round(Math.sqrt(Math.pow(n.display.x, 2) + Math.pow(n.display.y, 2))));

      expect(uniq(roundedDists)[0]).toBe(roundedDists[0]);
      expect(uniq(roundedDists)[0]).toBe(roundedDists[roundedDists.length-1]);
    });

    it("doesn't arrange nodes with existing coordinates", () => {
      let graph2 = Graph.prepareLayout(basicGraph, 'circleLayout');
      let x2s = values(graph2.nodes).map(n => n.display.x);
      let y2s = values(graph2.nodes).map(n => n.display.y);

      let graph3 = Graph.prepareLayout(graph2, 'circleLayout');
      let x3s = values(graph3.nodes).map(n => n.display.x);
      let y3s = values(graph3.nodes).map(n => n.display.y);

      expect(x2s).toEqual(x3s);
      expect(y2s).toEqual(y3s);
    });
  });

  describe("updateEdgePosition", () => {

    const graph2 = Graph.prepareLayout(basicGraph, 'circleLayout');
    const edge = graph2.edges[1];
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

    it("doesn't alter already-positioned captions", () => {
      let graph2 = merge({}, basicGraph, { captions: { 1: { display: { 
        scale: 2, 
        status: "highlighted", 
        x: -100, 
        y: -100 
      } } } });
      let graph3 = Graph.prepareLayout(graph2, 'circleLayout');
      let graph4 = Graph.prepareCaptions(graph3);

      expect(graph3.captions[1]).toEqual(graph4.captions[1]);
    });
  });

  describe("moveNode", () => {

    const nodeId = Object.keys(preparedGraph.nodes)[0];
    const edges = Graph.edgesConnectedToNode(preparedGraph, nodeId);
    const newX = 377;
    const newY = 610;
    const graph2 = Graph.moveNode(preparedGraph, nodeId, newX, newY);

    it("moves a node to a specific position", () => {
      expect(graph2.nodes[nodeId].display.x).toBe(newX);
      expect(graph2.nodes[nodeId].display.y).toBe(newY);
    });

    it("doesn't move any other nodes", () => {
      let xs = values(preparedGraph.nodes).map(n => n.display.x);
      let ys = values(preparedGraph.nodes).map(n => n.display.y);
      let x2s = values(graph2.nodes).map(n => n.display.x);
      let y2s = values(graph2.nodes).map(n => n.display.y);

      let deltaXs = xs.map((x, i) => x - x2s[i]);
      let deltaYs = ys.map((y, i) => y - y2s[i]);

      // only one deltaX and deltaY should be non-zero
      expect(deltaXs.filter(x => x !== 0).length).toBe(1);
      expect(deltaYs.filter(y => y !== 0).length).toBe(1);
    });

    it("moves all edges connected to the node", () => {
      let node2 = graph2.nodes[nodeId];
      let edges2 = Graph.edgesConnectedToNode(graph2, nodeId);

      // count connected edges without an endpoint at the node's position
      let count = edges2.filter(e => { 
        return (e.display.x1 !== node2.display.x || e.display.y1 !== node2.display.y) && 
               (e.display.x2 !== node2.display.x || e.display.y2 !== node2.display.y);
      }).length;

      expect(count).toBe(0);
    });
  });

  describe("moveEdge", () => {

    it("moves an edge's control point to a specific position", () => {
      let edgeId = Object.keys(preparedGraph.edges)[0];
      let newCx = 377;
      let newCy = 610;
      let graph2 = Graph.moveEdge(preparedGraph, edgeId, newCx, newCy);

      expect(graph2.edges[edgeId].display.cx).toBe(newCx);
      expect(graph2.edges[edgeId].display.cy).toBe(newCy);
    });
  });

  describe("moveCaption", () => {

    it("moves a caption to a specific position", () => {
      let captionId = Object.keys(preparedGraph.captions)[0];
      let newX = 377;
      let newY = 610;
      let graph2 = Graph.moveCaption(preparedGraph, captionId, newX, newY);

      expect(graph2.captions[captionId].display.x).toBe(newX);
      expect(graph2.captions[captionId].display.y).toBe(newY);
    });
  });

  describe("addSurroundingNodes", () => {

    let nodeIds, nodes, graph2, centerNode, x, y, graph3;

    beforeEach(() => {
      nodeIds = range(10, 20);
      nodes = nodeIds.map(n => {
        return { id: n, display: { name: `Node ${n}` } };
      });
      graph2 = Graph.circleLayout(basicGraph, true);
      centerNode = values(graph2.nodes)[0];
      ({ x, y } = centerNode.display);
      graph3 = Graph.addSurroundingNodes(graph2, centerNode.id, nodes);      
    });

    it("arranges new nodes equidistant from the center coordinates", () => {
      let roundedDists = values(pick(graph3.nodes, nodeIds))
        .map(n => Math.round(Math.sqrt(Math.pow(n.display.x - x, 2) + Math.pow(n.display.y - y, 2))));

      expect(uniq(roundedDists)[0]).toBe(roundedDists[0]);
      expect(uniq(roundedDists)[0]).toBe(roundedDists[roundedDists.length-1]);
    });

    it("sets defaults for new nodes", () => {
      let scales = values(pick(graph3.nodes), nodeIds)
        .map(n => n.display.scale);

      expect(scales).toBeArrayOfNumbers;
    });
  });
});