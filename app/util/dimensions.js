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


export function graphBounds() {

}
