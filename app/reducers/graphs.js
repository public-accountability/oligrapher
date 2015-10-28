import { LOAD_GRAPH, SHOW_GRAPH, MOVE_NODE, MOVE_EDGE } from '../actions';
import NodeDisplaySettings from '../NodeDisplaySettings';
import _ from 'lodash';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function prepareGraph(graph) {
  graph = clone(graph);
  graph.edges = _.values(graph.edges).reduce((result, edge) => { 
    return _.merge(result, { [edge.id]: updateEdgePosition(graph, edge) });
  }, {});
  return graph;
}

function updateEdgePosition(graph, edge) {
  // get nodes connected by edge
  let n1 = _.values(graph.nodes).find(n => n.id == edge.node1_id);
  let n2 = _.values(graph.nodes).find(n => n.id == edge.node2_id);

  // shortcut variables
  let x1 = n1.display.x;
  let y1 = n1.display.y;
  let x2 = n2.display.x;
  let y2 = n2.display.y;
  let r1 = n1.display.scale * NodeDisplaySettings.circleRadius;
  let r2 = n2.display.scale * NodeDisplaySettings.circleRadius;
  let cx = edge.display.cx;
  let cy = edge.display.cy;

  // set edge position at midpoint between nodes
  let x = (x1 + x2) / 2;
  let y = (y1 + y2) / 2;

  // keep track of which node is on left and right ("a" is left, "b" is right)
  let xa, ya, xb, yb, is_reverse;
  if (x1 < x2) {
    xa = x1;
    ya = y1;
    xb = x2;
    yb = y2;
    is_reverse = false;
  } else {
    xa = x2;
    ya = y2;
    xb = x1;
    yb = y1;
    is_reverse = true;
  }

  // generate curve offset if it doesn't exist
  if (cx == null || cy == null) {
    let strength = 0.1;
    cx = -(ya - y) * strength;
    cy = (xa - x) * strength;
  }

  // calculate absolute position of curve midpoint
  let mx = cx + x;
  let my = cy + y;

  // curves should not reach the centers of nodes but rather stop at their edges, so we:

  // calculate spacing between curve endpoint and node center
  let sa = is_reverse ? n2.display.scale : n1.display.scale;
  let sb = is_reverse ? n1.display.scale : n2.display.scale;
  let ra = (is_reverse ? r2 : r1) + (sa * NodeDisplaySettings.circleSpacing);
  let rb = (is_reverse ? r1 : r2) + (sb * NodeDisplaySettings.circleSpacing);

  // calculate angle from curve midpoint to node center
  let angleA = Math.atan2(ya - my, xa - mx);
  let angleB = Math.atan2(yb - my, xb - mx);

  // x and y offsets for curve endpoints are the above spacing times the cos and sin of the angle
  let xma = ra * Math.cos(angleA);
  let yma = ra * Math.sin(angleA);
  let xmb = rb * Math.cos(angleB);
  let ymb = rb * Math.sin(angleB);

  // finally update edge with new curve endpoints
  xa = xa - xma;
  ya = ya - yma;
  xb = xb - xmb;
  yb = yb - ymb;
  console.log(xa, ya);

  return _.merge(edge, { display: { x, y, cx, cy, is_reverse, xa, ya, xb, yb } });
}

function moveNode(graph, nodeId, x, y) {
  return _.merge(
    graph, 
    { nodes: { [nodeId]: { display: { x, y } } } },
    { edges: _.values(graph.edges).reduce((result, edge) => {
        return _.merge(result, { [edge.id]: (edge.node1_id == nodeId || edge.node2_id == nodeId) ? updateEdgePosition(graph, edge) : edge });
      }, {}) }
  );

  // graph = clone(graph); // clone graph before mutation

  // // move node
  // graph.nodes[nodeId].display.x = x;
  // graph.nodes[nodeId].display.y = y;

  // // move connected edges
  // graph.edges = _.values(graph.edges).reduce((result, edge) => {
  //   return _.merge(result, { [edge.id]: (edge.node1_id == nodeId || edge.node2_id == nodeId) ? updateEdgePosition(graph, edge) : edge });
  // }, {});

  // return graph;
}

function moveEdge(graph, edgeId, cx, cy) {
  return _.merge(graph, { edges: { [edgeId]: updateEdgePosition(graph, _.merge(graph.edges[edgeId], { display: { cx, cy } })) } });
}

export default function graphs(state = {}, action) {
  switch (action.type) {
  case LOAD_GRAPH:
    state = clone(state);
    state[action.graph.id] = prepareGraph(action.graph);
    console.log(state);
    return state;
  case MOVE_NODE:
    state = clone(state);
    state[action.graphId] = moveNode(state[action.graphId], action.nodeId, action.x, action.y);
    return state;
  case MOVE_EDGE:
    state = clone(state);
    state[action.graphId] = moveEdge(state[action.graphId], action.edgeId, action.cx, action.cy);
    return state;
  default:
    return state;
  }
}