/*
data store
--------------------------------------------
x1, y1           Node1 (center of node)
x2, y2           Node2 (center of node)
cx, cy           curve offset (from midpoint)
s1 & s2          Scale of Nodes 1 & 2

{ x, y, cx, cy, xa, ya, xb, yb, is_reverse }

// `M ${xa}, ${ya} Q ${x + cx}, ${y + cy}, ${xb}, ${yb}`
geometry
----------------------------------------------
x, y              midpoint
xa, ya            Left (point0 of Quadratic Curve)
xb, yb            Right (point2 of Quadratic Curve)
cx, cy            curve offset (stored in)
is_reverse
*/

import toNumber from 'lodash/toNumber'
import chunk from  'lodash/chunk'

const curveStrength = 0.5
const circleRadius = 25
const circleSpacing = 4

// (Node, Node) --> Node
function leftNode(a, b) {
  if (a.x <= b.x) {
    return a
  } else {
    return b
  }
}

function rightNode(a, b) {
  if (leftNode(a, b).id === a.id) {
    return b
  } else {
    return a
  }
}

export function midpoint(start, end) {
  let x = (start.x + end.x) / 2
  let y = (start.y + end.y) / 2
  return {x, y}
}

// Node, Node, Number ---> { x: number, y: number }
// export function defaultOffset(leftNode, rightNode, curveStrength = 0.5) {
//   const midP = midpoint(leftNode, rightNode)
//   const x = -(leftNode.display.y - midP.y)
//   const y = leftNode.display.x  - midP.x

//   return mapValues({ x, y }, n => n * curveStrength)
// }

// export function defaultControlPoint(node1, node2) {
//   const nodeL = leftNode(node1, node2)
//   const nodeR = rightNode(node1, node2)
//   const midP = midpoint(nodeL, nodeR)
//   const offset = defaultOffset(nodeL, nodeR)

//   return { x: midP.x + offset.x,
//            y: midP.y + offset.y }

// }

// export function curveString(p1, p2, p3) {
//   return `M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`
// }


// string --> [ [int, int] ]
export function parseCurveString(str) {
  return chunk(str.replace(/(M|Q)/g, '').trim().split(/[ ]+/).map(toNumber), 2)
}

/*
  Creates a curve string used by the <path> element to draw edges
  The curve is a Quadratic Bezier curve.
  It takes 3 points (p1, p2, p3) to draw the curve. We also refer to p2 as the "control" point.

  See the documentation on Q paths here: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

  node1 and node2 are required. If the control point is not provided a default value will be calculated.
*/
// export function calculateCurve(node1, node2) {
//   const p1 = xy(leftNode(node1, node2).display)
//   const p2 = defaultControlPoint(node1, node2)
//   const p3 = xy(rightNode(node1, node2).display)
//   return curveString(p1, p2, p3)
// }


/*
  input: curveString, side (START or END), deleats

*/
// export function moveCurvePointOld(curve, side, deltas) {
//   const [p1, p2, p3] = parseCurveString(curve)

//   if (side === 'START') {
//     return curveString(
//       translatePoint(xyFromArray(p1), deltas),
//       xyFromArray(p2),
//       xyFromArray(p3)
//     )
//   } else if (side === 'END') {
//     return curveString(
//       xyFromArray(p1),
//       xyFromArray(p2),
//       translatePoint(xyFromArray(p3), deltas)
//     )
//   } else {
//     throw new Error("Invalid side")
//   }

// }

// function angleBetweenPoints(a, b) {
//   return Math.atan2(b.y - a.y, b.x - a.x)
// }

// function rotatePoint(point, angle) {
//   const cos = Math.cos(angle)
//   const sin = Math.sin(angle)

//   return { x: point.x * cos - point.y * sin,
//            y: point.x * sin + point.y * cos }
// }

// export function moveCurvePoint(curveString, side, deltas) {
//   const curve = parseCurveString(curveString).map(xyFromArray)
//   const futureCurve = clone(curve)

//   if (side === 'START') {
//     futureCurve[0] = translatePoint(curve[0], deltas)
//   } else {
//     futureCurve[2] = translatePoint(curve[2], deltas)
//   }

//   const deltaAngle = angleBetweenPoints(futureCurve[0], futureCurve[2]) - angleBetweenPoints(curve[0], curve[2])

//   futureCurve[1] = rotatePoint(curve[1], deltaAngle)

//   return curveString(...futureCurve)

// }
export function calculateGeometry(edge) {
  let { cx, cy, x1, y1, x2, y2, s1, s2 } = edge
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
export function curveFromGeometry(geometry) {
  const start = [geometry.xa, geometry.ya]
  const control = [(geometry.x + geometry.cx), (geometry.y + geometry.cy)]
  const end = [geometry.xb, geometry.yb]
  return "M " + start.join(' ') + " Q " + control.concat(end).join(' ')
}

// export function curveFromLegacyEdge(edgeDisplay) {
//   return curveFromGeometry(calculateGeometry(edgeDisplay))
// }
// util: {
  //   midpoint: midpoint,
  //   // defaultControlPoint: defaultControlPoint,
  //   // defaultOffset: defaultOffset,
  //   parseCurveString: parseCurveString,
  //   calculateGeometry: calculateGeometry
  // },
  // from: {
  //   geometry: curveFromGeometry,
  //   // legacyEdge: curveFromLegacyEdge,
  //   // nodes: calculateCurve
  // }

export default {
  calculateGeometry: calculateGeometry,
  curveFromGeometry: curveFromGeometry
}
