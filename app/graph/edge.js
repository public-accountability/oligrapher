import merge from 'lodash/merge'
import { generate } from 'shortid'
import { calculateCurve } from '../util/curve'

const edgeDefaults = {
  id: null,
  node1_id: null,
  node2_id: null,
  display: {
    label: null,
    cx: null,
    cy: null,
    scale: 1,
    arrow: null,
    dash: null,
    status: "normal",
    url: null
  }
}

// Edge ---> {x, y} || null
function controlPoint(edge) {
  if (edge.display.cx && edge.display.cy) {
    return { x: edge.display.cx, y: edge.display.cy }
  } else {
    return null
  }
}

export function newEdge(attributes = {}) {
  let edge = merge({}, edgeDefaults, attributes)

  if (!edge.id) {
    edge.id = generate()
  }

  return edge
}


export function edgeProps(nodes, edge) {
  return {
    key:    edge.id,
    node1:  nodes[edge.node1_id],
    node2:  nodes[edge.node2_id],
    curve:  calculateCurve(nodes[edge.node1_id], nodes[edge.node2_id], controlPoint(edge))
  }

}


const curveStrength = 0.5
const circleRadius = 25
const circleSpacing = 4

export function calculateGeometry(state) {
  // let edge = this.props.edge;
  let { cx, cy, x1, y1, x2, y2, s1, s2 } = state
  let r1 = s1 * circleRadius
  let r2 = s2 * circleRadius

  // set edge position at midpoint between nodes
  let x = (x1 + x2) / 2
  let y = (y1 + y2) / 2

  // keep track of which node is on left and right ("a" is left, "b" is right)
  let xa, ya, xb, yb, is_reverse

  if (x1 < x2) {
    xa = x1
    ya = y1
    xb = x2
    yb = y2
    is_reverse = false
  } else {
    xa = x2
    ya = y2
    xb = x1
    yb = y1
    is_reverse = true
  }

  // generate curve offset if it doesn't exist
  if (!cx || !cy) {
    cx = -(ya - y) * curveStrength
    cy = (xa - x) * curveStrength
  }

  // calculate absolute position of curve midpoint
  let mx = cx + x
  let my = cy + y

  // curves should not reach the centers of nodes but rather stop at their edges, so we:

  // calculate spacing between curve endpoint and node center
  let sa = is_reverse ? s2 : s1
  let sb = is_reverse ? s1 : s2
  let ra = (is_reverse ? r2 : r1) + (sa * circleSpacing)
  let rb = (is_reverse ? r1 : r2) + (sb * circleSpacing)

  // calculate angle from curve midpoint to node center
  let angleA = Math.atan2(ya - my, xa - mx)
  let angleB = Math.atan2(yb - my, xb - mx)

  // x and y offsets for curve endpoints are the above spacing times the cos and sin of the angle
  let xma = ra * Math.cos(angleA)
  let yma = ra * Math.sin(angleA)
  let xmb = rb * Math.cos(angleB)
  let ymb = rb * Math.sin(angleB)

  // Update edge with new curve endpoints
  xa = xa - xma
  ya = ya - yma
  xb = xb - xmb
  yb = yb - ymb

  return { x, y, cx, cy, xa, ya, xb, yb, is_reverse }
}


// `M ${xa}, ${ya} Q ${x + cx}, ${y + cy}, ${xb}, ${yb}`,
function curve(geometry) {
  const start = [geometry.xa, geometry.ya]
  const control = [(geometry.x + geometry.cx), (geometry.y + geometry.cy)]
  const end = [geometry.xb, geometry.yb]

  return 'M ' + start.join(',') + ' Q ' + control.concat(end).join(',')
}

// Arrows indicate directionality.
    // if an arrow is '1->2' it means that the arrows goes from "node1" to "node2"
    // and therefore the marker should be placed at the end of the path.
    // However, if the path is reversed (meaning node 2 is to the left of node 1)
    // then the arrow should be placed at the start.
    // Possible arrow values: '1->2', '2->1', 'both'

    // str, boolean -> str
function markerStartArrow(arrow, is_reverse) {
  if (arrow === "1->2" && is_reverse) {
    return "url(#marker2)"
  } else if (arrow === "2->1" && !is_reverse) {
    return "url(#marker2)"
  } else if (arrow === 'both') {
    return "url(#marker2)"
  } else {
    return ""
  }
}

    // str, boolean -> str
function markerEndArrow(arrow, is_reverse) {
  if (arrow === "1->2" && !is_reverse) {
    return "url(#marker1)"
  } else if (arrow === "2->1" && is_reverse) {
    return "url(#marker1)"
  } else if (arrow === 'both') {
    return "url(#marker1)"
  } else {
    return ""
  }
}

const DASH_PARAMS = "5, 2"
const edgeSettings =  {
  lineColor: {
    normal: "#999",
    highlighted: "#999",
    faded: "#ddd"
  },
  textColor: {
    normal: "#999",
    highlighted: "#444",
    faded: "#ddd"
  },
  bgColor: {
    normal: "#fff",
    highlighted: "#ff0",
    faded: "#fff"
  },
  bgOpacity: {
    normal: 0,
    highlighted: 0.5,
    faded: 0
  }
}

export function svgParams(edge) {
  const { scale, arrow, dash, status } = edge.display
  // geometry attributes:  x, y, cx, cy, xa, ya, xb, yb, is_reverse
  const geometry = calculateGeometry(edge.display)

  return {
    curve: curve(geometry),
    pathId: `path-${edge.id}`,
    groupId: `edge-${edge.id}`,
    dash: dash ? DASH_PARAMS : "",
    fontSize:  10 * Math.sqrt(scale),
    textPath: null, // textPath: { __html: `<textPath class="labelpath" startOffset="50%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${pathId}" font-size="${fontSize}">${label}</textPath>` }
    dy: -6 * Math.sqrt(scale),
    markerStart: markerStartArrow(arrow, geometry.is_reverse),
    markerEnd: markerEndArrow(arrow, geometry.is_reverse),
    lineColor: edgeSettings.lineColor[status],
    textColor: edgeSettings.textColor[status],
    bgColor: edgeSettings.bgColor[status],
    bgOpacity: edgeSettings.bgOpacity[status]
  }
}

function calculateEdgeAngle(edge) {
  const { x1, y1, x2, y2 } = edge.display
  return Math.atan2(y2 - y1, x2 - x1)
}

function rotatePoint(x, y, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  }
}




/**
 * Calculates New Position for Draggable Components
 * @param {object} draggableData - data from react-draggable callback
 * @param {object} startPosition - initial x & y position
 * @param {object} startDrag - initial draggableData from start of drag
 * @param {number} actualZoom - zoom value
 * @returns {object} = x, y
 */
export function calculateDeltas(draggableData, startPosition, startDrag, zoom) {
  const deltaX = (draggableData.x - startDrag.x) / zoom
  const deltaY = (draggableData.y - startDrag.y) / zoom
  const x = deltaX + startPosition.x
  const y = deltaY + startPosition.y
  return { x, y }
}

/*
  Returns an new edge updated with new coordinates according to the x, y
  of the provided node.

  input: Object (Edge), Object (Node), Object ({x, y})
  output: Object (Edge)
*/
export function moveEdgeNode(edge, node, coords) {
  const { x, y } = coords

  let angle = calculateEdgeAngle(edge)
  const { cx, cy } = calculateGeometry(edge.display)
  const nodeIsNodeOne = node.id === edge.node1_id
  let newEdge = merge({}, edge, { display: (nodeIsNodeOne ? { x1: x, y1: y } : { x2: x, y2: y }) }, { cx, cy })
  let newAngle = calculateEdgeAngle(newEdge)
  let deltaAngle = newAngle - angle
  let rotatedPoint = rotatePoint(newEdge.cx, newEdge.cy, deltaAngle)
  return merge(newEdge, { display: { cx: rotatedPoint.x, cy: rotatedPoint.y } })
  // const edgeDisplay = (edge.node1_id === node.id) ? { x1: coords.x, y1: coords.y } : { x2: coords.x, y2: coords.y }
  // const newEdge = merge({}, edge, { display: edgeDisplay }, { display: { cx: cx, cy: cy } })
  // const deltaAngle = calculateEdgeAngle(newEdge) - calculateEdgeAngle(edge)
  // const rotatedPoint = rotatePoint(newEdge.cx, newEdge.cy, deltaAngle)
  // const updatedDisplay = { display: { cx: rotatedPoint.x, cy: rotatedPoint.y } }
  // return merge(newEdge, updatedDisplay)
  // return edge
}

export default {
  "new": newEdge,
  "moveEdgeNode": moveEdgeNode,
  "edgeProps": edgeProps
}
