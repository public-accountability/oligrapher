jest.unmock("../graph");
jest.unmock("../../models/Graph");
jest.unmock("../../models/Node");
jest.unmock("../../models/Edge");
jest.unmock("../../models/Helpers");

import reducer from "../graph";
import Graph from '../../models/Graph';
import Node from '../../models/Node';
import Edge from '../../models/Edge';
import Helpers from '../../models/Helpers';
import merge from 'lodash/object/merge';
import assign from 'lodash/object/assign';
import values from 'lodash/object/values';
import uniq from 'lodash/array/uniq';
import keys from 'lodash/object/keys';

describe("graph reducer", () => {

  const graph = {
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

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  describe("ADD_NODE", () => {

    it("should add a node with only a name", () => { 
      let newGraph = reducer(graph, {
        type: 'ADD_NODE',
        node: { display: { name: "Dick Cheney" } }
      });

      expect(values(newGraph.nodes).length).toBe(values(graph.nodes).length + 1);
    }); 

    it("should preserve the id of the added node", () => {
      let newGraph = reducer(graph, { 
        type: 'ADD_NODE',
        node: { id: "angler", display: { name: "Dick Cheney" } }
      });
      let newNode = newGraph.nodes["angler"];

      expect(newNode.display.name).toBe("Dick Cheney");

    });

    it("should set position coordinates for the new node if not provided", () => {
      let newGraph = reducer(graph, { 
        type: 'ADD_NODE',
        node: { id: "angler", display: { name: "Dick Cheney" } }
      });
      let newNode = newGraph.nodes["angler"];

      expect(newNode.display.x).toEqual(jasmine.any(Number));
      expect(newNode.display.y).toEqual(jasmine.any(Number));
    });
  });

  describe("ADD_EDGE", () => {

    it("should add an edge with only two node ids and a label", () => {
      let newGraph = reducer(graph, {
        type: 'ADD_EDGE',
        edge: { node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      });

      expect(values(newGraph.edges).length).toBe(values(graph.edges).length + 1);
    });

    it("should preserve the id of the added edge", () => {
      let newGraph = reducer(graph, {
        type: 'ADD_EDGE',
        edge: { id: "someid", node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      });
      let newEdge = newGraph.edges["someid"];

      expect(newEdge.display.label).toBe("best friend");
    });

    it("should give endpoint coordinates to the added edge", () => {
      let preparedGraph = Graph.prepare(graph);
      let newGraph = reducer(preparedGraph, {
        type: 'ADD_EDGE',
        edge: { id: "someid", node1_id: 1, node2_id: 2, display: { label: "best friend" } }
      });

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
      nodeId: nodeId
    };

    it("should remove the node from the graph", () => {
      let newGraph = reducer(graph, action);

      expect(values(newGraph.nodes).length).toBe(values(graph.nodes).length - 1);
      expect(newGraph.nodes[nodeId]).toBeUndefined();
    });

    it("should remove all of the node's edges", () => {
      let newGraph = reducer(graph, action);
      let edges = Graph.edgesConnectedToNode(graph, nodeId);
      let newEdges = edges.map(edge => newGraph.edges[edge.id]);

      expect(uniq(newEdges)).toEqual([undefined]);
    });
  });

  describe("DELETE_EDGE", () => {

    const edgeId = 2;
    const action = {
      type: 'DELETE_EDGE',
      edgeId: edgeId
    };

    it("should remove the edge from the graph", () => {
      let newGraph = reducer(graph, action);

      expect(values(newGraph.edges).length).toBe(values(graph.edges).length - 1);
      expect(newGraph.edges[edgeId]).toBeUndefined();
    });

    it("should not remove any nodes from the graph", () => {
      let newGraph = reducer(graph, action);

      expect(values(newGraph.nodes).length).toBe(values(graph.nodes).length);
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
      selection: selection
    };

    it("should delete the selection and any edges connected to it", () => {
      let newGraph = reducer(graph, action);

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
      nodeId: nodeId,
      data: update
    };
    let newGraph;

    beforeEach(() => {
      newGraph = reducer(graph, action);
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
      let newGraph2 = reducer(newGraph, action2);

      expect(newGraph2.nodes[nodeId].display.image).toBeUndefined();
    })

    it("should revert to default values when required fields are removed", () => {
      let update2 = { display: { scale: null } };
      let action2 = assign({}, action, { data: update2 });
      let newGraph2 = reducer(newGraph, action2);
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
      edgeId: edgeId,
      data: update
    };
    let newGraph;

    beforeEach(() => {
      newGraph = reducer(graph, action);
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
      let newGraph2 = reducer(newGraph, action2);

      expect(newGraph2.edges[edgeId].display.url).toBeUndefined();
    })

    it("should revert to default values when required fields are removed", () => {
      let update2 = { display: { scale: null } };
      let action2 = assign({}, action, { data: update2 });
      let newGraph2 = reducer(newGraph, action2);
      let defaults = Edge.defaults();

      expect(newGraph2.edges[edgeId].display.scale).toBe(defaults.display.scale);
    });
  });

  describe("PRUNE_GRAPH", () => {

    const deleteAction = {
      type: 'DELETE_EDGE',
      edgeId: 1
    };

    const pruneAction = {
      type: 'PRUNE_GRAPH',
    };

    let graph2, graph3;

    beforeEach(() => {
      graph2 = reducer(graph, deleteAction);
      graph3 = reducer(graph2, pruneAction);
    });

    it("should remove all unconnected nodes", () => {
      expect(graph3.nodes[1]).toBeUndefined();
      expect(graph3.nodes[2]).not.toBeUndefined();
    });
  });
});
