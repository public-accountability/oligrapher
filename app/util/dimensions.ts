import { Point, xy } from "./geometry"
import { Viewbox } from "../graph/graph"
import fromPairs from "lodash/fromPairs"
import zip from "lodash/zip"
import { getElementById } from "./helpers"
import { SvgSizeType } from "./defaultState"

export const SVG_ID = "oligrapher-svg"

// Utilities for dimension calculations

// Computes how far the svg viewbox's minX and minY is from 0, 0
export function computeSvgOffset(viewBox: Viewbox): Point {
  return {
    x: -(viewBox.minX + Math.trunc(viewBox.w / 2)),
    y: -(viewBox.minY + Math.trunc(viewBox.h / 2)),
  }
}

// Transforms viewpoint coordinates into SVG coordinates
export function svgCoordinatesFromMouseEvent(event: MouseEvent) {
  return svgCoordinatesFromPoint({ x: event.clientX, y: event.clientY })
}

export function svgCoordinatesFromPoint(point: Point) {
  const matrix = getElementById(SVG_ID).getScreenCTM().inverse()
  return xy(DOMPoint.fromPoint(point).matrixTransform(matrix))
}

export function documentSvgSize(): SvgSizeType {
  const svg = getElementById(SVG_ID)
  return {
    width: svg.clientWidth,
    height: svg.clientHeight,
  }
}

export function viewBoxToString(viewBox: Viewbox): string {
  return [viewBox.minX, viewBox.minY, viewBox.w, viewBox.h].join(" ")
}

export function stringToViewBox(s: String) {
  return fromPairs(zip(["minX", "minY", "w", "h"], s.split(" ").map(Number))) as Viewbox
}

export function svgRectToViewbox(rect: SVGRect): Viewbox {
  return { minX: rect.x, minY: rect.y, w: rect.width, h: rect.height }
}

export function calculateSvgScale(zoom: number): number {
  const svg = getElementById(SVG_ID) as SVGSVGElement
  const clientRect = svg.getBoundingClientRect()
  const viewBox = svg.viewBox.baseVal

  if (clientRect.width / clientRect.height > viewBox.width / viewBox.height) {
    return (clientRect.height / viewBox.height) * zoom
  } else {
    return (clientRect.width / viewBox.width) * zoom
  }
}

export function zoomForScale(scale: number): number {
  const svg = getElementById(SVG_ID)
  return scale / (svg.getBoundingClientRect().width / svg.viewBox.baseVal.width)
}

export function calculateSvgHeight(): number {
  const containerHeight = getElementById("oligrapher-container").clientHeight
  const headerHeight =
    document.getElementById("oligrapher-header")?.clientHeight ||
    document.getElementById("oligrapher-header-condensed")?.clientHeight
  const svgHeight = containerHeight - headerHeight - 1
  return svgHeight
}
