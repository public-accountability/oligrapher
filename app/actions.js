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

/*
 * action creators
 */

export function loadGraph(graph) {
  return { type: LOAD_GRAPH, graph: graph, id: graph.id };
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
