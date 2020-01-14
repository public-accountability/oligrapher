/**
 * Calculates New Position for Draggable Components
 * @param {object} draggableData - data from react-draggable callback
 * @param {object} startPosition - initial x & y position
 * @param {object} startDrag - initial draggableData from start of drag
 * @param {number} actualZoom - zoom value
 * @returns {object} = x, y
 */
export function calculateDeltas(draggableData, startPosition, startDrag, zoom) {
  const deltaX = (draggableData.x - startDrag.x) / zoom
  const deltaY = (draggableData.y - startDrag.y) / zoom
  const x = deltaX + startPosition.x
  const y = deltaY + startPosition.y
  return { x, y }
}
