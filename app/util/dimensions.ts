import { Point, xy } from './geometry'
import { Viewbox } from '../graph/graph'
import { querySelector } from './helpers'

export const SVG_ID = 'oligrapher-svg'

// Utilities for dimension calculations.
// Used primarily to help placement of editing windows.

// Zooming out effectively expands a given viewbox,
// and zooming in contracts it. This function returns
// a new viewbox based on a given zoom factor.
export function applyZoomToViewBox(viewBox: Viewbox, zoom: number): Viewbox {
  let { minX, minY, w, h } = viewBox

  const zoomW = w / zoom
  const zoomH = h / zoom
  const zoomMinX = minX + (w / 2) - (zoomW / 2)
  const zoomMinY = minY + (h / 2) - (zoomH / 2)

  return {
    minX: zoomMinX,
    minY: zoomMinY,
    w: zoomW,
    h: zoomH
  }
}

// The outermost svg element automatically zooms its content
// in order to fit the viewbox within the element's dimensions.
// This function calculates this automatic zoom so as to inform
// other zoom-dependent calculations.
export function computeSvgZoom(viewBox: Viewbox, svgSize: { width: number, height: number }): number {
  const { width, height } = svgSize
  const xFactor = width / viewBox.w
  const yFactor = height / viewBox.h
  return Math.min(xFactor, yFactor)
}

// Computes how far the svg viewbox's minX and minY is from 0, 0
export function computeSvgOffset(viewBox: Viewbox): Point {
  return {
    x: -(viewBox.minX + Math.trunc(viewBox.w / 2)),
    y: -(viewBox.minY + Math.trunc(viewBox.h / 2))
  }
}

// Event can be any object with the attributes clientX or clientY, typically MouseEvent
// It transforms regular viewpoint coordinates into the correct SVG coordinates, considing the
export function svgCoordinatesFromMouseEvent(event: MouseEvent): Point {
  const svg = document.getElementById(SVG_ID) as SVGSVGElement
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY

  // An oligrapher map can be zoomed and panned. This gets the transformation from those elements (see <Pannable> and <Zoomable>)
  const pannableMatrix = querySelector('g.pannable').transform.baseVal.getItem(0).matrix
  const zoomableMatrix = querySelector('g.zoomable').transform.baseVal.getItem(0).matrix

  // @ts-ignore: svg could be null
  const matrix = svg
    .getScreenCTM()
    .multiply(pannableMatrix)
    .multiply(zoomableMatrix)
    .inverse()

  return xy(point.matrixTransform(matrix))
}

export function viewBoxToString(viewBox: Viewbox): string {
  return [viewBox.minX, viewBox.minY, viewBox.w, viewBox.h].join(' ')
}
