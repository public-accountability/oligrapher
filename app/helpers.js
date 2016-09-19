/**
 * Calculates New Position for Draggable Components
 * @param {object} draggableData - data from react-draggable callback
 * @param {object} startPosition - initial x & y position 
 * @param {object} startDrag - initial draggableData from start of drag
 * @param {number} actualZoom - zoom value
 * @returns {object} = x, y 
 */
export const calculateDeltas = (draggableData, startPosition, startDrag, actualZoom) => {
  let deltaX = (draggableData.x - startDrag.x) / actualZoom;
  let deltaY = (draggableData.y - startDrag.y) / actualZoom;
  let x = deltaX + startPosition.x;
  let y = deltaY + startPosition.y;
  return { x, y };
};
