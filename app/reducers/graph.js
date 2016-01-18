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
import undoable, { excludeAction, distinctState } from 'redux-undo';

function graph(state = null, action) {
  let newState, graph;

  switch (action.type) {

  case NEW_GRAPH:
  case LOAD_GRAPH:
    return Graph.prepare(action.graph);

  case MOVE_NODE:
    return Graph.moveNode(state, action.nodeId, action.x, action.y);

  case MOVE_EDGE:
    return Graph.moveEdge(state, action.edgeId, action.cx, action.cy);

  case MOVE_CAPTION:
    return Graph.moveCaption(state, action.captionId, action.x, action.y) 

  case SWAP_NODE_HIGHLIGHT:
    return Graph.swapNodeHighlight(state, action.nodeId, action.singleSelect);

  case SWAP_EDGE_HIGHLIGHT:
    return Graph.swapEdgeHighlight(state, action.edgeId, action.singleSelect);

  case SWAP_CAPTION_HIGHLIGHT:
    return Graph.swapCaptionHighlight(state, action.captionId, action.singleSelect);

  case ADD_NODE:
    return Graph.addNode(state, action.node);

  case ADD_EDGE:
    return Graph.addEdge(state, action.edge);

  case ADD_CAPTION:
    return Graph.addCaption(state, action.caption);

  case ADD_SURROUNDING_NODES:
    return Graph.addSurroundingNodes(state, action.centerId, action.nodes);

  case DELETE_NODE:
    return Graph.deleteNode(state, action.nodeId);

  case DELETE_EDGE:
    return Graph.deleteEdge(state, action.edgeId);

  case DELETE_CAPTION:
    return Graph.deleteCaption(state, action.captionId);

  case DELETE_SELECTION:
    return Graph.deleteCaptions(
      Graph.deleteNodes(
        Graph.deleteEdges(
          state, 
          action.selection.edgeIds
        ),
        action.selection.nodeIds
      ),
      action.selection.captionIds
    );

  case DELETE_ALL:
    return Graph.defaults();
  
  case UPDATE_NODE:
    // update connected edges to ensure that endpoints are correct in case node scale changed
    return Graph.prepareEdges(
      Graph.updateNode(state, action.nodeId, action.data)
    );

  case UPDATE_EDGE:
    return Graph.updateEdge(state, action.edgeId, action.data);

  case UPDATE_CAPTION:
    return Graph.updateCaption(state, action.captionId, action.data);

  case PRUNE_GRAPH:
    return Graph.prune(state);

  case LAYOUT_CIRCLE:
    return Graph.prepareEdges(Graph.circleLayout(state, true));

  case SET_HIGHLIGHTS:
    return Graph.setHighlights(state, action.highlights, action.otherwiseFaded);

  default:
    return state;
  }
}

// export default undoable(graphs, { filter: excludeAction([LOAD_GRAPH, SHOW_GRAPH, TOGGLE_EDIT_TOOLS]) });
// export default undoable(graphs, { filter: distinctState() });
export default undoable(graph, { filter: function filterState(action, currentState, previousState) {
  // only add to history if not initializing graph and state changed
  return ([LOAD_GRAPH, SHOW_GRAPH].indexOf(action.type) === -1) && (currentState !== previousState);
} });