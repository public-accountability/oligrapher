import { Point, xy } from './geometry'
import { Viewbox } from '../graph/graph'
import fromPairs from 'lodash/fromPairs'
import zip from 'lodash/zip'
import { getElementById } from './helpers'
import { SvgSizeType } from './defaultState'

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
  const point = DOMPoint.fromPoint({x: event.clientX, y: event.clientY})
  const matrix = document.getElementById(SVG_ID).getScreenCTM().inverse()
  return xy(point.matrixTransform(matrix))
}

export function svgCoordinatesFromPoint(point: Point): Point {
  const matrix = getElementById(SVG_ID).getScreenCTM().inverse()
  return xy(DOMPoint.fromPoint(point).matrixTransform(matrix))
}

export function documentSvgSize(): SvgSizeType {
  const svg = getElementById(SVG_ID)
  return {
    width: svg.clientWidth,
    height: svg.clientHeight
  }
}

export function viewBoxToString(viewBox: Viewbox): string {
  return [viewBox.minX, viewBox.minY, viewBox.w, viewBox.h].join(' ')
}

export function stringToViewBox(s: String) {
  return fromPairs(zip(['minX', 'minY', 'w', 'h'], s.split(' ').map(Number))) as Viewbox
}

export function svgRectToViewbox(rect: SVGRect): Viewbox {
  return { minX: rect.x,
           minY: rect.y,
           w: rect.width,
           h: rect.height }
}



// The outermost svg element automatically zooms its content
// in order to fit the viewbox within the element's dimensions.
// This function calculates this automatic zoom so as to inform
// other zoom-dependent calculations.
// export function computeSvgZoom(viewBox: Viewbox, svgSize: { width: number, height: number }): number {
//   const { width, height } = svgSize
//   const xFactor = width / viewBox.w
//   const yFactor = height / viewBox.h
//   return Math.min(xFactor, yFactor)
// }
