import { LOAD_GRAPH, SHOW_GRAPH, NEW_GRAPH,
         MOVE_NODE, MOVE_EDGE, MOVE_CAPTION, 
         SWAP_NODE_HIGHLIGHT, SWAP_EDGE_HIGHLIGHT, SWAP_CAPTION_HIGHLIGHT,
         ADD_NODE, ADD_EDGE, ADD_CAPTION, ADD_SURROUNDING_NODES,
         DELETE_NODE, DELETE_EDGE, DELETE_CAPTION, DELETE_SELECTION, DELETE_ALL,
         UPDATE_NODE, UPDATE_EDGE, UPDATE_CAPTION,
         PRUNE_GRAPH, LAYOUT_CIRCLE,
         SET_HIGHLIGHTS, TOGGLE_EDIT_TOOLS } from '../actions';
import Graph from '../models/Graph';
import Edge from '../models/Edge';
import merge from 'lodash/object/merge'; 
import assign from 'lodash/object/assign';
import shortid from 'shortid';
import undoable, { excludeAction, distinctState } from 'redux-undo';

function graphs(state = {}, action) {
  let newState, graph;

  switch (action.type) {

  case NEW_GRAPH:
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

  case SWAP_CAPTION_HIGHLIGHT:
    return merge({}, state, { 
      [action.graphId]: Graph.swapCaptionHighlight(state[action.graphId], action.captionId, action.singleSelect) 
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

  case ADD_SURROUNDING_NODES:
    return merge({}, state, { 
      [action.graphId]: Graph.addSurroundingNodes(state[action.graphId], action.centerId, action.nodes)
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

  case DELETE_ALL:
    return assign({}, state, {
      [action.graphId]: assign({}, state[action.graphId], Graph.defaultContent())
    });
  
  case UPDATE_NODE:
    // update connected edges to ensure that endpoints are correct in case node scale changed
    return assign({}, state, {
      [action.graphId]: Graph.prepareEdges(
        Graph.updateNode(state[action.graphId], action.nodeId, action.data)
      )
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

  case LAYOUT_CIRCLE:
    return assign({}, state, {
      [action.graphId]: Graph.prepareEdges(Graph.circleLayout(state[action.graphId], true))
    });

  case SET_HIGHLIGHTS:
    return assign({}, state, {
      [action.graphId]: Graph.setHighlights(state[action.graphId], action.highlights, action.otherwiseFaded)
    });

  default:
    return state;
  }
}

// export default undoable(graphs, { filter: excludeAction([LOAD_GRAPH, SHOW_GRAPH, TOGGLE_EDIT_TOOLS]) });
// export default undoable(graphs, { filter: distinctState() });
export default undoable(graphs, { filter: function filterState(action, currentState, previousState) {
  // only add to history if not initializing graph and state changed
  return ([LOAD_GRAPH, SHOW_GRAPH].indexOf(action.type) === -1) && (currentState !== previousState);
} });