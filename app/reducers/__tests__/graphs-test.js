jest.dontMock('../graphs');
jest.dontMock('../../models/Graph');
jest.dontMock('../../models/Node');
jest.dontMock('../../models/Edge');
jest.dontMock('../../models/Helpers');

const reducer = require('../graphs');
const Graph = require('../../models/Graph'); 
const Node = require('../../models/Node'); 
const Edge = require('../../models/Edge'); 
const Helpers = require('../../models/Helpers'); 
const merge = require('lodash/object/merge');
const assign = require('lodash/object/assign');
const values = require('lodash/object/values'); 
const uniq = require('lodash/array/uniq'); 
const keys = require('lodash/object/keys');

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
      2: { id: 2, node1_id: 2, node2_id: 3, display: { label: "Edge 2" } }
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

  describe("DELETE_NODE", () => {

    const nodeId = 2;
    const action = {
      type: 'DELETE_NODE',
      graphId: basicGraph.id,
      nodeId: nodeId
    };

    it("should remove the node from the graph", () => {
      let newGraph = reducer(graphs, action)[basicGraph.id];

      expect(values(newGraph.nodes).length).toBe(values(basicGraph.nodes).length - 1);
      expect(newGraph.nodes[nodeId]).toBeUndefined();
    });

    it("should remove all of the node's edges", () => {
      let newGraph = reducer(graphs, action)[basicGraph.id];
      let edges = Graph.edgesConnectedToNode(basicGraph, nodeId);
      let newEdges = edges.map(edge => newGraph.edges[edge.id]);

      expect(uniq(newEdges)).toEqual([undefined]);
    });
  });

  describe("DELETE_EDGE", () => {

    const edgeId = 2;
    const action = {
      type: 'DELETE_EDGE',
      graphId: basicGraph.id,
      edgeId: edgeId
    };

    it("should remove the edge from the graph", () => {
      let newGraph = reducer(graphs, action)[basicGraph.id];

      expect(values(newGraph.edges).length).toBe(values(basicGraph.edges).length - 1);
      expect(newGraph.edges[edgeId]).toBeUndefined();
    });

    it("should not remove any nodes from the graph", () => {
      let newGraph = reducer(graphs, action)[basicGraph.id];

      expect(values(newGraph.nodes).length).toBe(values(basicGraph.nodes).length);
    });
  });

  describe("DELETE_SELECTION", () => {

    const selection = {
      nodeIds: [1],
      edgeIds: [2],
      captionIds: [1]
    };
    const action = {
      type: 'DELETE_SELECTION',
      graphId: basicGraph.id,
      selection: selection
    };

    it("should delete the selection and any edges connected to it", () => {
      let newGraph = reducer(graphs, action)[basicGraph.id];

      expect(keys(newGraph.nodes)).toEqual(['2', '3']);
      expect(keys(newGraph.edges)).toEqual([]);
      expect(keys(newGraph.captions)).toEqual([]);
    });
  });

  describe("UPDATE_NODE", () => {

    const nodeId = 1;
    const update = { 
      id: 100, 
      display: { 
        name: "Angela Merkel", 
        image: "http://www.opinionspost.com/wp-content/uploads/2015/07/Angela_Merkel_1.jpg",
        scale: 3
      }
    };
    const action = {
      type: 'UPDATE_NODE',
      graphId: basicGraph.id,
      nodeId: nodeId,
      data: update
    };
    let newGraph;

    beforeEach(() => {
      newGraph = reducer(graphs, action)[basicGraph.id];
    });

    it("should update the node's display and data objects with new data", () => {
      expect(newGraph.nodes[nodeId].display.name).toBe(update.display.name);
      expect(newGraph.nodes[nodeId].display.image).toBe(update.display.image);
      expect(newGraph.nodes[nodeId].display.scale).toBe(update.display.scale);
    });

    it("should not overwrite the node id", () => { 
      expect(newGraph.nodes[nodeId].id).toBe(nodeId);
    });

    it("should remove data when provided null values", () => {
      let update2 = { display: { image: null } };
      let action2 = assign({}, action, { data: update2 });
      let graphs2 = assign({}, graphs, { [basicGraph.id]: newGraph });
      let newGraph2 = reducer(graphs2, action2)[basicGraph.id];

      expect(newGraph2.nodes[nodeId].display.image).toBeUndefined();
    })

    it("should revert to default values when required fields are removed", () => {
      let update2 = { display: { scale: null } };
      let action2 = assign({}, action, { data: update2 });
      let graphs2 = assign({}, graphs, { [basicGraph.id]: newGraph });
      let newGraph2 = reducer(graphs2, action2)[basicGraph.id];
      let defaults = Node.defaults();

      expect(newGraph2.nodes[nodeId].display.scale).toBe(defaults.display.scale);
    });
  });

  describe("UPDATE_EDGE", () => {

    const edgeId = 1;
    const update = { 
      id: 125, 
      display: { 
        label: "CEO", 
        scale: 2,
        arrow: true,
        url: "https://www.blackstone.com/the-firm/overview/our-people/stephen-a-schwarzman"
      }
    };
    const action = {
      type: 'UPDATE_EDGE',
      graphId: basicGraph.id,
      edgeId: edgeId,
      data: update
    };
    let newGraph;

    beforeEach(() => {
      newGraph = reducer(graphs, action)[basicGraph.id];
    });

    it("should update the edge's display and data objects with new data", () => {
      expect(newGraph.edges[edgeId].display.label).toBe(update.display.label);
      expect(newGraph.edges[edgeId].display.scale).toBe(update.display.scale);
      expect(newGraph.edges[edgeId].display.arrow).toBe(update.display.arrow);
      expect(newGraph.edges[edgeId].display.url).toBe(update.display.url);
    });

    it("should not overwrite the edge id", () => { 
      expect(newGraph.edges[edgeId].id).toBe(edgeId);
    });

    it("should remove data when provided null values", () => {
      let update2 = { display: { url: null } };
      let action2 = assign({}, action, { data: update2 });
      let graphs2 = assign({}, graphs, { [basicGraph.id]: newGraph });
      let newGraph2 = reducer(graphs2, action2)[basicGraph.id];

      expect(newGraph2.edges[edgeId].display.url).toBeUndefined();
    })

    it("should revert to default values when required fields are removed", () => {
      let update2 = { display: { scale: null } };
      let action2 = assign({}, action, { data: update2 });
      let graphs2 = assign({}, graphs, { [basicGraph.id]: newGraph });
      let newGraph2 = reducer(graphs2, action2)[basicGraph.id];
      let defaults = Edge.defaults();

      expect(newGraph2.edges[edgeId].display.scale).toBe(defaults.display.scale);
    });
  });

  describe("PRUNE_GRAPH", () => {

    const deleteAction = {
      type: 'DELETE_EDGE',
      graphId: basicGraph.id,
      edgeId: 1
    };

    const pruneAction = {
      type: 'PRUNE_GRAPH',
      graphId: basicGraph.id
    };

    let graphs2, graphs3, graph3;

    beforeEach(() => {
      graphs2 = reducer(graphs, deleteAction);
      graphs3 = reducer(graphs2, pruneAction);
      graph3 = graphs3[basicGraph.id];
    });

    it("should remove all unconnected nodes", () => {
      expect(graph3.nodes[1]).toBeUndefined();
      expect(graph3.nodes[2]).not.toBeUndefined();
    });
  });

  describe("LAYOUT_CIRCLE", () => {

  });
});
