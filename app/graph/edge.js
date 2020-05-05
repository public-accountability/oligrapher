import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import isNumber from 'lodash/isNumber'

import { generate } from 'shortid'

import { stringOrBool } from '../util/types'

const edgeDefaults = {
  id: null,
  node1_id: null,
  node2_id: null,
  status: "normal",
  label: null,
  scale: 1,
  arrow: false,
  dash: false,
  url: null,
  x1: null,
  y1: null,
  x2: null,
  y2: null,
  cx: null,
  cy: null,
  s1: null,
  s2: null
}

export function newEdge(attributes = {}) {
  let edge = merge({}, edgeDefaults, attributes)

  if (!edge.id) {
    edge.id = generate()
  }

  if (isNumber(edge.id)) {
    edge.id = edge.id.toString()
  }

  return edge
}

export function newEdgeFromNodes(n1, n2, attributes = {}) {
  let edge = newEdge(attributes)
  edge.node1_id = n1.id
  edge.node2_id = n2.id
  edge.x1 = n1.x
  edge.y1 = n1.y
  edge.s1 = n1.scale
  edge.x2 = n2.x
  edge.y2 = n2.y
  edge.s2 = n2.scale

  return edge
}

export function edgeCoordinates(nodeNumber, coordinates) {
  if (nodeNumber === 1) {
    return { x1: coordinates.x, y1: coordinates.y }
  } else if (nodeNumber === 2) {
    return { x2: coordinates.x, y2: coordinates.y }
  } else {
    throw new Error("Node number must be 1 or 2")
  }
}

export const edgeShape = {
  id: PropTypes.string.isRequired,
  node1_id: PropTypes.string.isRequired,
  node2_id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['normal']),
  label: PropTypes.string,
  scale: PropTypes.number,
  arrow: stringOrBool.isRequired,
  dash: stringOrBool,
  url: PropTypes.string,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  s1: PropTypes.number,
  s2: PropTypes.number
}

const types = {
  edge: PropTypes.shape(edgeShape),
  arrayOfEdges: PropTypes.arrayOf(PropTypes.shape(edgeShape))
}

export default {
  "new": newEdge,
  "newEdgeFromNodes": newEdgeFromNodes,
  "types": types
}



// Arrows indicate directionality.
    // if an arrow is '1->2' it means that the arrows goes from "node1" to "node2"
    // and therefore the marker should be placed at the end of the path.
    // However, if the path is reversed (meaning node 2 is to the left of node 1)
    // then the arrow should be placed at the start.
    // Possible arrow values: '1->2', '2->1', 'both'

    // str, boolean -> str
// function markerStartArrow(arrow, is_reverse) {
//   if (arrow === "1->2" && is_reverse) {
//     return "url(#marker2)"
//   } else if (arrow === "2->1" && !is_reverse) {
//     return "url(#marker2)"
//   } else if (arrow === 'both') {
//     return "url(#marker2)"
//   } else {
//     return ""
//   }
// }

    // str, boolean -> str
// function markerEndArrow(arrow, is_reverse) {
//   if (arrow === "1->2" && !is_reverse) {
//     return "url(#marker1)"
//   } else if (arrow === "2->1" && is_reverse) {
//     return "url(#marker1)"
//   } else if (arrow === 'both') {
//     return "url(#marker1)"
//   } else {
//     return ""
//   }
// }

// const DASH_PARAMS = "5, 2"
// const edgeSettings =  {
//   lineColor: {
//     normal: "#999",
//     highlighted: "#999",
//     faded: "#ddd"
//   },
//   textColor: {
//     normal: "#999",
//     highlighted: "#444",
//     faded: "#ddd"
//   },
//   bgColor: {
//     normal: "#fff",
//     highlighted: "#ff0",
//     faded: "#fff"
//   },
//   bgOpacity: {
//     normal: 0,
//     highlighted: 0.5,
//     faded: 0
//   }
// }

// export function svgParams(edge) {
//   const { scale, arrow, dash, status } = edge.display
//   // geometry attributes:  x, y, cx, cy, xa, ya, xb, yb, is_reverse
//   const geometry = calculateGeometry(edge.display)

//   return {
//     curve: curve(geometry),
//     pathId: `path-${edge.id}`,
//     groupId: `edge-${edge.id}`,
//     dash: dash ? DASH_PARAMS : "",
//     fontSize:  10 * Math.sqrt(scale),
//     textPath: null, // textPath: { __html: `<textPath class="labelpath" startOffset="50%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${pathId}" font-size="${fontSize}">${label}</textPath>` }
//     dy: -6 * Math.sqrt(scale),
//     markerStart: markerStartArrow(arrow, geometry.is_reverse),
//     markerEnd: markerEndArrow(arrow, geometry.is_reverse),
//     lineColor: edgeSettings.lineColor[status],
//     textColor: edgeSettings.textColor[status],
//     bgColor: edgeSettings.bgColor[status],
//     bgOpacity: edgeSettings.bgOpacity[status]
//   }
// }

// function calculateEdgeAngle(edge) {
//   const { x1, y1, x2, y2 } = edge.display
//   return Math.atan2(y2 - y1, x2 - x1)
// }

// function rotatePoint(x, y, angle) {
//   const cos = Math.cos(angle)
//   const sin = Math.sin(angle)

//   return {
//     x: x * cos - y * sin,
//     y: x * sin + y * cos
//   }
// }


/*
  Returns an new edge updated with new coordinates according to the x, y of the provided node.

  Input: Object (Edge), Object (Node), Object ({x, y})
  Output: Object (Edge)
*/
// export function moveEdgeNode(edge, node, coords) {
//   const { x, y } = coords

//   let angle = calculateEdgeAngle(edge)
//   const { cx, cy } = calculateGeometry(edge.display)
//   const nodeIsNodeOne = node.id === edge.node1_id
//   let newEdge = merge({}, edge, { display: (nodeIsNodeOne ? { x1: x, y1: y } : { x2: x, y2: y }) }, { cx, cy })
//   let newAngle = calculateEdgeAngle(newEdge)
//   let deltaAngle = newAngle - angle
//   let rotatedPoint = rotatePoint(newEdge.cx, newEdge.cy, deltaAngle)
//   return merge(newEdge, { display: { cx: rotatedPoint.x, cy: rotatedPoint.y } })
//   // const edgeDisplay = (edge.node1_id === node.id) ? { x1: coords.x, y1: coords.y } : { x2: coords.x, y2: coords.y }
//   // const newEdge = merge({}, edge, { display: edgeDisplay }, { display: { cx: cx, cy: cy } })
//   // const deltaAngle = calculateEdgeAngle(newEdge) - calculateEdgeAngle(edge)
//   // const rotatedPoint = rotatePoint(newEdge.cx, newEdge.cy, deltaAngle)
//   // const updatedDisplay = { display: { cx: rotatedPoint.x, cy: rotatedPoint.y } }
//   // return merge(newEdge, updatedDisplay)
//   // return edge
// }
