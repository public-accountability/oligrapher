import { combineReducers } from 'redux';
import { 
  LOAD_GRAPH, SHOW_GRAPH, 
  ZOOM_IN, ZOOM_OUT, RESET_ZOOM, 
  MOVE_NODE 
} from './actions';
import NodeDisplaySettings from './NodeDisplaySettings';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function prepareGraph(graph) {
  graph = clone(graph);
  graph.edges = graph.edges.map(edge => prepareEdge(graph, edge));
  return graph;
}

function prepareEdge(graph, edge) {
  // get nodes connected by edge
  let n1 = graph.nodes.find(n => n.id == edge.node1_id);
  let n2 = graph.nodes.find(n => n.id == edge.node2_id);

  // shortcut variables
  let x1 = n1.display.x;
  let y1 = n1.display.y;
  let x2 = n2.display.x;
  let y2 = n2.display.y;

  // set edge position at midpoint between nodes
  let ax = edge.display.x = (x1 + x2) / 2;
  let ay = edge.display.y = (y1 + y2) / 2;

  // if edge already has (relative) curve midpoint, make it absolute by adding it to edge midpoint
  // ACTUALLY, NO: WE WANT TO KEEP TRACK OF RELATIVE CURVE MIDPOINT FOR WHEN A NODE IS MOVED

  // if (edge.display.cx != null && edge.display.cy != null) {
  //   edge.display.cx += ax;
  //   edge.display.cy += ay;
  // }  

  // keep track of which node is on left and right ("a" is left, "b" is right)
  let xa, ya, xb, yb;
  if (x1 < x2) {
    xa = x1;
    ya = y1;
    xb = x2;
    yb = y2;
    edge.display.is_reverse = false;
  } else {
    xa = x2;
    ya = y2;
    xb = x1;
    yb = y1;
    edge.display.is_reverse = true;
  }

  // generate curve offset if it doesn't exist
  if (edge.display.cx == null || edge.display.cy == null) {
    let strength = 0.1;
    edge.display.cx = -(ya - ay) * strength;
    edge.display.cy = (xa - ax) * strength;
  }

  // edge.display.cx = 50;
  // edge.display.cy = 50;

  return updateEdgePosition(graph, edge);
}

function updateEdgePosition(graph, edge) {
  // get nodes connected by edge
  let n1 = graph.nodes.find(n => n.id == edge.node1_id);
  let n2 = graph.nodes.find(n => n.id == edge.node2_id);

  // shortcut variables
  let x1 = n1.display.x;
  let y1 = n1.display.y;
  let x2 = n2.display.x;
  let y2 = n2.display.y;
  let r1 = n1.display.scale * NodeDisplaySettings.circleRadius;
  let r2 = n2.display.scale * NodeDisplaySettings.circleRadius;

  // set edge position at midpoint between nodes
  let mx = edge.display.x = (x1 + x2) / 2;
  let my = edge.display.y = (y1 + y2) / 2;

  // calculate absolute position of curve midpoint
  let cx = edge.display.cx + mx;
  let cy = edge.display.cy + my;

  // keep track of which node is on left and right ("a" is left, "b" is right)
  let xa, ya, xb, yb;
  if (x1 < x2) {
    xa = x1;
    ya = y1;
    xb = x2;
    yb = y2;
    edge.display.is_reverse = false;
  } else {
    xa = x2;
    ya = y2;
    xb = x1;
    yb = y1;
    edge.display.is_reverse = true;
  }

  // curves should not reach the centers of nodes but rather stop at their edges, so we:

  // calculate spacing between curve endpoint and node center
  let sa = edge.display.is_reverse ? n2.display.scale : n1.display.scale;
  let sb = edge.display.is_reverse ? n1.display.scale : n2.display.scale;
  let ra = (edge.display.is_reverse ? r2 : r1) + (sa * NodeDisplaySettings.circleSpacing);
  let rb = (edge.display.is_reverse ? r1 : r2) + (sb * NodeDisplaySettings.circleSpacing);

  // calculate angle from curve midpoint to node center
  let angleA = Math.atan2(ya - cy, xa - cx);
  let angleB = Math.atan2(yb - cy, xb - cx);

  // x and y offsets for curve endpoints are the above spacing times the cos and sin of the angle
  let xma = ra * Math.cos(angleA);
  let yma = ra * Math.sin(angleA);
  let xmb = rb * Math.cos(angleB);
  let ymb = rb * Math.sin(angleB);

  // finally update edge with new curve endpoints
  edge.display.xa = xa - xma;
  edge.display.ya = ya - yma;
  edge.display.xb = xb - xmb;
  edge.display.yb = yb - ymb;

  return edge;
}

function moveNode(graph, nodeId, x, y) {
  graph = clone(graph); // clone graph before mutation

  // move node
  let index = graph.nodes.findIndex(node => node.id == nodeId);
  graph.nodes[index].display.x = x;
  graph.nodes[index].display.y = y;

  // move connected edges
  graph.edges = graph.edges.map(edge => {
    return (edge.node1_id == nodeId || edge.node2_id == nodeId) ? updateEdgePosition(graph, edge) : edge;
  });

  return graph;
}

function graphs(state = [], action) {
  switch (action.type) {
  case LOAD_GRAPH:
    return [...state, prepareGraph(action.graph)];
  case MOVE_NODE:
    let index = state.findIndex(graph => graph.id == action.graphId);
    return [
      ...state.slice(0, index), 
      moveNode(state[index], action.nodeId, action.x, action.y), 
      ...state.slice(index + 1)
    ];
  default:
    return state;
  }
}

function position(state = { prevId: null, currentId: null }, action) {
  switch (action.type) {
  case SHOW_GRAPH:
    return { prevId: state.currentId, currentId: action.id };
  default:
    return state;
  }
}

function zoom(state = 1, action) {
  switch (action.type) {
  case ZOOM_IN:
  case ZOOM_OUT:
    return state * action.factor;
  case RESET_ZOOM:
    return 1;
  default:
    return state;
  }
}

const oligrapherApp = combineReducers({
  graphs,
  position,
  zoom
});

export default oligrapherApp;