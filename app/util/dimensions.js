/*
  Utilities for dimension calculations.
  Used primarily to help placement of editing windows.
*/

export function computeActualZoom(viewBox, domNode) {
  const { width, height } = domNode.getBoundingClientRect()
  const xFactor = width / viewBox.w
  const yFactor = height / viewBox.h
  return Math.min(xFactor, yFactor)
}


export function graphBounds() {

}
