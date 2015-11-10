jest.dontMock('../graphs');
jest.dontMock('../../models/Graph');
jest.dontMock('../../models/Node');
jest.dontMock('../../models/Edge');

const reducer = require('../graphs');
const Graph = require('../../models/Graph'); 
const Node = require('../../models/Node'); 
const Edge = require('../../models/Edge'); 
const { merge, values } = require('lodash');

describe("graph reducer", () => {

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

  const graphs = { [basicGraph.id]: basicGraph };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  describe("ADD_NODE", () => {

    it("should add a node with only a name", () => { 
      let newGraph = reducer(graphs, {
        type: 'ADD_NODE',
        graphId: basicGraph.id,
        node: { display: { name: "Dick Cheney" } }
      })[basicGraph.id];

      expect(values(newGraph.nodes).length).toBe(values(basicGraph.nodes).length + 1);
    }); 

    it("should preserve the id of the added node", () => {
      let newGraph = reducer(graphs, { 
        type: 'ADD_NODE',
        graphId: basicGraph.id,
        node: { id: "angler", display: { name: "Dick Cheney" } }
      })[basicGraph.id];
      let newNode = newGraph.nodes["angler"];

      expect(newNode.display.name).toBe("Dick Cheney");

    });

    it("should set position coordinates for the new node if not provided", () => {
      let newGraph = reducer(graphs, { 
        type: 'ADD_NODE',
        graphId: basicGraph.id,
        node: { id: "angler", display: { name: "Dick Cheney" } }
      })[basicGraph.id];
      let newNode = newGraph.nodes["angler"];

      expect(newNode.display.x).toEqual(jasmine.any(Number));
      expect(newNode.display.y).toEqual(jasmine.any(Number));
    });
  });

  describe("ADD_EDGE", () => {

    it("should add an edge with only two node ids and a label", () => {
      let newGraph = reducer(graphs, {
        type: 'ADD_EDGE',
        graphId: basicGraph.id,
        edge: { node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      })[basicGraph.id];

      expect(values(newGraph.edges).length).toBe(values(basicGraph.edges).length + 1);
    });

    it("should preserve the id of the added node", () => {
      let newGraph = reducer(graphs, {
        type: 'ADD_EDGE',
        graphId: basicGraph.id,
        edge: { id: "someid", node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      })[basicGraph.id];
      let newEdge = newGraph.edges["someid"];

      expect(newEdge.display.label).toBe("best friend");
    });

    it("should give endpoint coordinates to the added node", () => {
      let graph = Graph.prepare(basicGraph);
      let newGraph = reducer(graphs, {
        type: 'ADD_EDGE',
        graphId: basicGraph.id,
        edge: { id: "someid", node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      })[basicGraph.id];

      let node1 = newGraph.nodes[1];
      let node2 = newGraph.nodes[2];
      let newEdge = newGraph.edges["someid"];

      expect(newEdge.display.x1).toBe(node1.display.x);
      expect(newEdge.display.y1).toBe(node1.display.y);
      expect(newEdge.display.x2).toBe(node2.display.x);
      expect(newEdge.display.y2).toBe(node2.display.y);
    });
  });
});
