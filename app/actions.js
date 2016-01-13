import Graph from './models/Graph';

/*
 * action types
 */

export const LOAD_GRAPH = 'LOAD_GRAPH';
export const SHOW_GRAPH = 'SHOW_GRAPH';
export const NEW_GRAPH = 'NEW_GRAPH';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const RESET_ZOOM = 'RESET_ZOOM';
export const MOVE_NODE = 'MOVE_NODE';
export const MOVE_EDGE = 'MOVE_EDGE';
export const MOVE_CAPTION = 'MOVE_CAPTION';
export const SWAP_NODE_HIGHLIGHT = 'SWAP_NODE_HIGHLIGHT';
export const SWAP_EDGE_HIGHLIGHT = 'SWAP_EDGE_HIGHLIGHT';
export const SWAP_CAPTION_HIGHLIGHT = 'SWAP_CAPTION_HIGHLIGHT';
export const SWAP_NODE_SELECTION = 'SWAP_NODE_SELECTION';
export const SWAP_EDGE_SELECTION = 'SWAP_EDGE_SELECTION';
export const SWAP_CAPTION_SELECTION = 'SWAP_CAPTION_SELECTION';
export const DESELECT_ALL = 'DESELECT_ALL';
export const ADD_NODE = 'ADD_NODE';
export const ADD_EDGE = 'ADD_EDGE';
export const ADD_CAPTION = 'ADD_CAPTION';
export const ADD_SURROUNDING_NODES = 'ADD_SURROUNDING_NODES';
export const DELETE_NODE = 'DELETE_NODE';
export const DELETE_EDGE = 'DELETE_EDGE';
export const DELETE_CAPTION = 'DELETE_CAPTION';
export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UPDATE_NODE = 'UPDATE_NODE';
export const UPDATE_EDGE = 'UPDATE_EDGE';
export const UPDATE_CAPTION = 'UPDATE_CAPTION';
export const PRUNE_GRAPH = 'PRUNE_GRAPH';
export const LAYOUT_CIRCLE = 'LAYOUT_CIRCLE';
export const DELETE_ALL = 'DELETE_ALL';
export const SET_HIGHLIGHTS = 'SET_HIGHLIGHTS';
export const TOGGLE_EDIT_TOOLS = 'TOGGLE_EDIT_TOOLS';
export const TOGGLE_ADD_FORM = 'TOGGLE_ADD_FORM';
export const SET_NODE_RESULTS = 'SET_NODE_RESULTS';
export const LOAD_ANNOTATIONS = 'LOAD_ANNOTATIONS';
export const SHOW_ANNOTATION = 'SHOW_ANNOTATION';
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const CREATE_ANNOTATION = 'CREATE_ANNOTATION';
export const TOGGLE_ANNOTATIONS = 'TOGGLE_ANNOTATIONS';
export const MOVE_ANNOTATION = 'MOVE_ANNOTATION';
export const SET_TITLE = 'SET_TITLE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const TOGGLE_HELP_SCREEN = 'TOGGLE_HELP_SCREEN';
export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';

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

export function newGraph() {
  let graph = Graph.defaults();
  return { type: NEW_GRAPH, graph };
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

export function swapCaptionHighlight(graphId, captionId) {
  return { type: SWAP_CAPTION_HIGHLIGHT, graphId, captionId };
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

export function deselectAll(graphId) {
  return { type: DESELECT_ALL, graphId };
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

export function addSurroundingNodes(graphId, centerId, nodes) {
  return { type: ADD_SURROUNDING_NODES, graphId, centerId, nodes };
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

export function deleteAll(graphId) {
  return { type: DELETE_ALL, graphId };
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

export function setHighlights(graphId, highlights, otherwiseFaded = false) {
  return { type: SET_HIGHLIGHTS, graphId, highlights, otherwiseFaded };
}

export function clearHighlights(graphId) {
  let highlights = { nodeIds: [], edgeIds: [], captionIds: [] };
  return { type: SET_HIGHLIGHTS, graphId, highlights };
}

export function toggleEditTools(value) {
  return { type: TOGGLE_EDIT_TOOLS, value };
}

export function toggleAddForm(form) {
  return { type: TOGGLE_ADD_FORM, form: form };
}

export function setNodeResults(nodes) {
  return { type: SET_NODE_RESULTS, nodes: nodes };
}

export function loadAnnotations(annotations) {
  return { type: LOAD_ANNOTATIONS, annotations };
}

export function showAnnotation(id) {
  return { type: SHOW_ANNOTATION, id };
}

export function updateAnnotation(id, data) {
  return { type: UPDATE_ANNOTATION, id, data };
}

export function deleteAnnotation(id) {
  return { type: DELETE_ANNOTATION, id };
}

export function createAnnotation(newIndex) {
  return { type: CREATE_ANNOTATION, newIndex };
}

export function moveAnnotation(fromIndex, toIndex) {
  return { type: MOVE_ANNOTATION, fromIndex, toIndex };
}

export function toggleAnnotations(value) {
  return { type: TOGGLE_ANNOTATIONS, value };
}

export function setTitle(title) {
  return { type: SET_TITLE, title };
}

export function setSettings(settings) {
  return { type: SET_SETTINGS, settings };
}

export function toggleHelpScreen(value) {
  return { type: TOGGLE_HELP_SCREEN, value };
}

export function toggleSettings(value) {
  return { type: TOGGLE_SETTINGS, value };
}