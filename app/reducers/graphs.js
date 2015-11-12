import { LOAD_GRAPH, SHOW_GRAPH, 
         MOVE_NODE, MOVE_EDGE, MOVE_CAPTION, 
         SWAP_NODE_HIGHLIGHT, SWAP_EDGE_HIGHLIGHT,
         ADD_NODE, ADD_EDGE, ADD_CAPTION,
         DELETE_NODE, DELETE_EDGE, DELETE_CAPTION, DELETE_SELECTION,
         UPDATE_NODE, UPDATE_EDGE, UPDATE_CAPTION,
         PRUNE_GRAPH } from '../actions';
import Graph from '../models/Graph';
import Edge from '../models/Edge';
import { merge, assign } from 'lodash';

export default function graphs(state = {}, action) {
  let newState, graph;

  switch (action.type) {

  case LOAD_GRAPH:
    let graph = Graph.prepare(action.graph);
    return merge({}, state, { [graph.id]: graph });

  case MOVE_NODE:
    return merge({}, state, { 
      [action.graphId]: Graph.moveNode(state[action.graphId], action.nodeId, action.x, action.y) 
    });

  case MOVE_EDGE:
    return merge({}, state, { 
      [action.graphId]: Graph.moveEdge(state[action.graphId], action.edgeId, action.cx, action.cy) 
    });

  case MOVE_CAPTION:
    return merge({}, state, { 
      [action.graphId]: Graph.moveCaption(state[action.graphId], action.captionId, action.x, action.y) 
    });

  case SWAP_NODE_HIGHLIGHT:
    return merge({}, state, { 
      [action.graphId]: Graph.swapNodeHighlight(state[action.graphId], action.nodeId, action.singleSelect) 
    });

  case SWAP_EDGE_HIGHLIGHT:
    return merge({}, state, { 
      [action.graphId]: Graph.swapEdgeHighlight(state[action.graphId], action.edgeId, action.singleSelect) 
    });

  case ADD_NODE:
    return merge({}, state, { 
      [action.graphId]: Graph.addNode(state[action.graphId], action.node) 
    });

  case ADD_EDGE:
    return merge({}, state, { 
      [action.graphId]: Graph.addEdge(state[action.graphId], action.edge)
    });

  case ADD_CAPTION:
    return merge({}, state, { 
      [action.graphId]: Graph.addCaption(state[action.graphId], action.caption)
    });

  case DELETE_NODE:
    return assign({}, state, {
      [action.graphId]: Graph.deleteNode(state[action.graphId], action.nodeId)
    });

  case DELETE_EDGE:
    return assign({}, state, { 
      [action.graphId]: Graph.deleteEdge(state[action.graphId], action.edgeId)
    });

  case DELETE_CAPTION:
    return assign({}, state, { 
      [action.graphId]: Graph.deleteCaption(state[action.graphId], action.captionId)
    });

  case DELETE_SELECTION:
    graph = Graph.deleteCaptions(
      Graph.deleteNodes(
        Graph.deleteEdges(
          state[action.graphId], 
          action.selection.edgeIds
        ),
        action.selection.nodeIds
      ),
      action.selection.captionIds
    );

    return assign({}, state, {
      [action.graphId]: graph
    });

  case UPDATE_NODE:
    return assign({}, state, {
      [action.graphId]: Graph.updateNode(state[action.graphId], action.nodeId, action.data)
    });

  case UPDATE_EDGE:
    return assign({}, state, {
      [action.graphId]: Graph.updateEdge(state[action.graphId], action.edgeId, action.data)
    });

  case UPDATE_CAPTION:
    return assign({}, state, {
      [action.graphId]: Graph.updateCaption(state[action.graphId], action.captionId, action.data)
    });

  case PRUNE_GRAPH:
    return assign({}, state, {
      [action.graphId]: Graph.prune(state[action.graphId])
    });

  default:
    return state;
  }
}