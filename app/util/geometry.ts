import pick from 'lodash/pick'

import { Edge } from '../graph/edge'

export interface Point {
  x: number,
  y: number
}

export function xy(obj: Point): Point {
  return pick(obj, ['x', 'y'])
}

export function translatePoint(point: Point, deltas: Point): Point {
  return {
    x: point.x + deltas.x,
    y: point.y + deltas.y
  }
}

export function rotatePoint(point: Point, angle: number): Point {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = point.x * cos - point.y * sin
  const y = point.x * sin + point.y * cos
  return { x, y }
}

export function distance(point1: Point, point2: Point): number {
  let a = point1.x - point2.x
  let b = point1.y - point2.y
  return Math.hypot(a, b)
}

export function calculateDeltas(draggableData: Point, startPosition: Point, startDrag: Point, zoom: number): Point {
  const deltaX = (draggableData.x - startDrag.x) / zoom
  const deltaY = (draggableData.y - startDrag.y) / zoom
  const x = deltaX + startPosition.x
  const y = deltaY + startPosition.y
  return { x, y }
}