import Graph from './models/Graph';

/*
 * action types
 */

export const LOAD_GRAPH = 'LOAD_GRAPH';
export const SHOW_GRAPH = 'SHOW_GRAPH';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const RESET_ZOOM = 'RESET_ZOOM';
export const MOVE_NODE = 'MOVE_NODE';
export const MOVE_EDGE = 'MOVE_EDGE';
export const MOVE_CAPTION = 'MOVE_CAPTION';
export const SWAP_NODE_HIGHLIGHT = 'SWAP_NODE_HIGHLIGHT';
export const SWAP_EDGE_HIGHLIGHT = 'SWAP_EDGE_HIGHLIGHT';
export const SWAP_NODE_SELECTION = 'SWAP_NODE_SELECTION';
export const SWAP_EDGE_SELECTION = 'SWAP_EDGE_SELECTION';
export const SWAP_CAPTION_SELECTION = 'SWAP_CAPTION_SELECTION';
export const ADD_NODE = 'ADD_NODE';
export const ADD_EDGE = 'ADD_EDGE';
export const ADD_CAPTION = 'ADD_CAPTION';
export const DELETE_NODE = 'DELETE_NODE';
export const DELETE_EDGE = 'DELETE_EDGE';
export const DELETE_CAPTION = 'DELETE_CAPTION';
export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UPDATE_NODE = 'UPDATE_NODE';
export const UPDATE_EDGE = 'UPDATE_EDGE';
export const UPDATE_CAPTION = 'UPDATE_CAPTION';
export const PRUNE_GRAPH = 'PRUNE_GRAPH';
export const LAYOUT_CIRCLE = 'LAYOUT_CIRCLE';

/*
 * action creators
 */

export function loadGraph(graph) {
  let graphWithId = Graph.setId(graph);
  return { type: LOAD_GRAPH, graph: graphWithId, id: graphWithId.id };
}

export function showGraph(id) {
  return { type: SHOW_GRAPH, id };
}

export function zoomIn(factor = 1.2) {
  return { type: ZOOM_IN, factor };
}

export function zoomOut(factor = 0.8333) {
  return { type: ZOOM_OUT, factor };
}

export function resetZoom() {
  return { type: RESET_ZOOM };
}

export function moveNode(graphId, nodeId, x, y) {
  return { type: MOVE_NODE, graphId, nodeId, x, y };
}

export function moveEdge(graphId, edgeId, cx, cy) {
  return { type: MOVE_EDGE, graphId, edgeId, cx, cy };
}

export function moveCaption(graphId, captionId, x, y) {
  return { type: MOVE_CAPTION, graphId, captionId, x, y };
}

export function swapNodeHighlight(graphId, nodeId) {
  return { type: SWAP_NODE_HIGHLIGHT, graphId, nodeId };
}

export function swapEdgeHighlight(graphId, edgeId) {
  return { type: SWAP_EDGE_HIGHLIGHT, graphId, edgeId };
}

export function swapNodeSelection(nodeId, singleSelect = true) {
  return { type: SWAP_NODE_SELECTION, nodeId, singleSelect };
}

export function swapEdgeSelection(edgeId, singleSelect = true) {
  return { type: SWAP_EDGE_SELECTION, edgeId, singleSelect };
}

export function swapCaptionSelection(captionId, singleSelect = true) {
  return { type: SWAP_CAPTION_SELECTION, captionId, singleSelect };
}

export function addNode(graphId, node) {
  return { type: ADD_NODE, graphId, node };
}

export function addEdge(graphId, edge) {
  return { type: ADD_EDGE, graphId, edge };
}

export function addCaption(graphId, caption) {
  return { type: ADD_CAPTION, graphId, caption };
}

export function deleteNode(graphId, nodeId) {
  return { type: DELETE_NODE, graphId, nodeId };
}

export function deleteEdge(graphId, edgeId) {
  return { type: DELETE_EDGE, graphId, edgeId };
}

export function deleteCaption(graphId, captionId) {
  return { type: DELETE_CAPTION, graphId, captionId };
}

export function deleteSelection(graphId, selection) {
  return { type: DELETE_SELECTION, graphId, selection };
}

export function updateNode(graphId, nodeId, data) {
  return { type: UPDATE_NODE, graphId, nodeId, data };
}

export function updateEdge(graphId, edgeId, data) {
  return { type: UPDATE_EDGE, graphId, edgeId, data };
}

export function updateCaption(graphId, captionId, data) {
  return { type: UPDATE_CAPTION, graphId, captionId, data };
}

export function pruneGraph(graphId) {
  return { type: PRUNE_GRAPH, graphId };
}

export function layoutCircle(graphId) {
  return { type: LAYOUT_CIRCLE, graphId };
}