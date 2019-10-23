import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'

// (Node, Node) --> Node
function leftNode(a, b) {
  if (a.display.x <= b.display.x) {
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

function midpoint(start, end) {
  let x = (start.display.x + end.display.x) / 2
  let y = (start.display.y + end.display.y) / 2
  return {x, y}
}

// Node, Node, Number ---> { x: number, y: number }
function defaultOffset(leftNode, rightNode, curveStrength = 0.5) {
  const midP = midpoint(leftNode, rightNode)
  const x = -(leftNode.display.y - midP.y)
  const y = leftNode.display.x  - midP.x

  return mapValues({ x, y }, n => n * curveStrength)
}

export function defaultControlPoint(node1, node2) {
  const nodeL = leftNode(node1, node2)
  const nodeR = rightNode(node1, node2)
  const midP = midpoint(nodeL, nodeR)
  const offset = defaultOffset(nodeL, nodeR)

  return { x: midP.x + offset.x,
           y: midP.y + offset.y }

}

export function curveString(p1, p2, p3) {
  return `M ${p1.x},${p1.y} Q ${p2.x},${p2.y} ${p3.x},${p3.y}`
}

/*
  Creates a curve string used by the <path> element to draw edges
  The curve is a Quadratic Bezier curve.
  It takes 3 points (p1, p2, p3) to draw the curve. We also refer to p2 as the "control" point.

  See the documentation on Q paths here: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

  node1 and node2 are required. If the control point is not provided a default value will be calculated.
*/
export function calculateCurve(node1, node2, control = null) {
  const p1 = pick(leftNode(node1, node2).display, ['x', 'y'])
  const p2 = control || defaultControlPoint(node1, node2)
  const p3 = pick(rightNode(node1, node2).display, ['x', 'y'])
  return curveString(p1, p2, p3)
}
