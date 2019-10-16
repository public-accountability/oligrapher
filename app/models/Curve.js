import mapValues from 'lodash/mapValues'
import { maybeSetValues } from './'

// (Node, Node) --> Node
function leftNode(a, b) {
  if (a.x < b.x) {
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
  let x = (start.x + end.x) / 2
  let y = (start.y + end.y) / 2
  return {x, y}
}

// Node, Node, Number ---> { x: number, y: number }
function defaultOffset(leftNode, rightNode, curveStrength = 0.5) {
  const midP = midpoint(leftNode, rightNode)
  const x = -(leftNode.y - midP.y)
  const y = leftNode.x  - midP.x

  return mapValues({ x, y }, n => n * curveStrength)
}

function defaultControlPoint(node1, node2) {
  const nodeL = leftNode(node1, node2)
  const nodeR = rightNode(node1, node2)
  const midP = midpoint(nodeL, nodeR)
  const offset = defaultOffset(nodeL, nodeR)

  return { x: midP.x + offset.x,
           y: midP.y + offset.y }

}

/*
  This class represents the curve used by the <path> element to draw edges
  The curve is a Quadratic Bezier curve.
  See the documentation on Q paths here: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

  const c = new Curve({ start: { x: 10, y: 20 },
                        end: { x: 30, y: 40 } })

  Start & end are required to be provided via the constructor.
  If the control point is not provided a default value will be calculated
*/
export default class Curve {
  start = null
  end = null
  control = null  // a default control point is calculated if not provided

  constructor(attributes) {
    maybeSetValues(attributes, this, 'start', 'end', 'control')

    if (!this.control) {
      this.control = defaultControlPoint(this.start, this.end)
    }
  }

  // The string for the "d" attribute of an SVG Path
  get d() {
    let start = `${this.start.x}, ${this.start.y}`
    let control = `${this.control.x}, ${this.control.y}`
    let end = `${this.end.x}, ${this.end.y}`

    return `M ${start} Q ${control},${end}`
  }
}

//   recalculate() {
//     this.control = cacluateBezier(this.start, this.end, this.strength)
//   }
// }


/*



           * [x2, y2]
control   /
      *  /   *
        /
        * [x1, y1]


   * [x1, y1]
    \
     \   *
   *  \
       \
         *[x2, y2]


function movePoint(start, offset) {
  return [ start.x + offset.x, offset.y + offset.y]
}


*/
