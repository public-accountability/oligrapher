import toNumber from 'lodash/toNumber'
import chunk from  'lodash/chunk'
import merge from 'lodash/merge'

import { Point } from '../util/geometry'
import { Edge, EdgeGeometry } from './edge'

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

export interface Curve {
  x: number,
  y: number,
  cx: number,
  cy: number,
  xa: number,
  ya: number,
  xb: number,
  yb: number,
  is_reverse: boolean
}

export const defaultCurveStrength = 0.5
const circleRadius = 25
const circleSpacing = 4

export function midpoint(start: Point, end: Point): Point {
  let x = (start.x + end.x) / 2
  let y = (start.y + end.y) / 2
  return { x, y }
}

export function parseCurveString(str: string) {
  return chunk(str.replace(/(M|Q)/g, '').trim().split(/[ ]+/).map(toNumber), 2)
}

export function edgeToCurve(edge: EdgeGeometry, curveStrength: number = defaultCurveStrength): Curve {
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

  // generate control point if it doesn't exist
  if (cx == null || cy == null) {
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
export function curveToBezier({ x, y, xa, ya, xb, yb, cx, cy }: Curve): string {
  const start = [xa, ya]
  const control = [(x + cx), (y + cy)]
  const end = [xb, yb]
  return "M " + start.join(' ') + " Q " + control.concat(end).join(' ')
}

// modifies control points of a group of edges between the same nodes
// so that the edges are nicely spaced out
export function curveSimilarEdges(edges: Edge[]): Edge[] {
  const count = edges.length

  // a single edge is not altered
  if (count === 1) {
    return edges
  }

  // curve strength is default if there are only 2 edges
  // curve strength approaches twice default as number of edges increases
  const maxCurveStrength = defaultCurveStrength * (3 - 2/count)
  const range = maxCurveStrength * 2
  const step = range / (count - 1)
  let startStrength = -maxCurveStrength

  return edges.map((edge, i) => {
    let strength = startStrength + (i * step)
    let { cx, cy } = edgeToCurve(edge, strength)
    edge = merge(edge, { cx, cy })
    return edge
  })
}
