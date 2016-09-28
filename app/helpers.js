import includes from 'lodash/includes';

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

/**
 * Previously arrow could only go in one direction. This converts a true value into 'left'
 * @param {string|boolean|null} arrow
 */
export const legacyArrowConverter = arrow => {
  if (includes(['left', 'right', 'both'], arrow)) {
    return arrow;
  } else {
    return arrow ? 'left' : false;
  }
};

// Determines new state of arrow: 
// input: string, string, boolean
// output: string | false;
// used by EdgeArrowSelector
export const newArrowState = (oldArrowState, arrowSide, showArrow) => {
  const rightSide = (arrowSide === 'right');
  const leftSide = (arrowSide === 'left');
  
  
  if(oldArrowState === 'left') {
    if (rightSide && showArrow) {
      return 'both';
    }
    if (leftSide && !showArrow) {
      return false;
    }
  } else if (oldArrowState === 'right') {
    if (leftSide && showArrow) {
      return 'both';
    }
    if (rightSide && !showArrow) {
      return false;
    }
  } else if (oldArrowState === 'both') {
    if (leftSide && !showArrow) {
      return 'right';
    }
    if (rightSide && !showArrow) {
      return 'left';
    }
  } else if (oldArrowState === false) {
    if (leftSide && showArrow) {
      return 'left';
    }
    if (rightSide && showArrow) {
      return 'right';
    }
  }
  // default case
  return oldArrowState;
};
