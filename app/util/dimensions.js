import { xy, toElement } from './helpers'

const SVG_ID = 'oligrapher-svg'

/*
  Utilities for dimension calculations.
  Used primarily to help placement of editing windows.
*/

export function computeActualZoom(viewBox, domNode, zoom = 1) {
  const { width, height } = domNode.getBoundingClientRect()
  const xFactor = width / (viewBox.w / zoom)
  const yFactor = height / (viewBox.h / zoom)
  return Math.min(xFactor, yFactor)
}

// Event => {xy}
// Event can be any object with the attributes clientX or clientY
// This takes a browser mouse event with regular viewpoint coordinates and transforms them into the correct SVG coordinates
export function svgCoordinatesFromMouseEvent(event) {
  const svg = toElement(SVG_ID)
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY

  // An oligrapher map can be zoomed and panned. This gets the transformation from those elements (see <Pannable> and <Zoomable>)
  const pannableMatrix = document.querySelector('g.pannable').transform.baseVal.getItem(0).matrix
  const zoonableMatrix = document.querySelector('g.zoomable').transform.baseVal.getItem(0).matrix

  const matrix = svg.getScreenCTM()
                    .multiply(pannableMatrix)
                    .multiply(zoonableMatrix)
                    .inverse()

  return xy(point.matrixTransform(matrix))
}
