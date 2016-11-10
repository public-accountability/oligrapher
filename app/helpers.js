import includes from 'lodash/includes';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

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
 * Previously arrow could only go in one direction 
 * @param {string|boolean|null} arrow
 */
export const legacyArrowConverter = arrow => {
  if (includes(['1->2', '2->1', 'both'], arrow)){
    return arrow;
  } else if (arrow === true) {
    return '1->2';
  } else if (arrow === 'left') {
    return '2->1';
  } else if (arrow === 'right') {
    return '1->2';
  } else {
    return false;
  }
};


export const legacyEdgesConverter = edges => {
  return mapValues(edges, edge => merge(edge, {display: {arrow: legacyArrowConverter(edge.display.arrow)}} ) );
};

export const newArrowState = (oldArrowState, arrowSide, showArrow) => {

  // By convention, Node 1 is the arrow on the left side 
  // and Node 2 is the arrow on the right.
  const node1 = (arrowSide === 'left');
  const node2 = (arrowSide === 'right');
  
  if(oldArrowState === '1->2') {
    if (node1 && showArrow) {
      return 'both';
    }
    if (node2 && !showArrow) {
      return false;
    }
  } else if (oldArrowState === '2->1') {
    if (node1 && !showArrow) {
      return false;
    }
    if (node2 && showArrow) {
      return 'both';
    }
  } else if (oldArrowState === 'both') {
    if (node1 && !showArrow) {
      return '1->2';
    }
    if (node2 && !showArrow) {
      return '2->1';
    }
  } else if (oldArrowState === false) {
    if (node1 && showArrow) {
      return '2->1';
    }
    if (node2 && showArrow) {
      return '1->2';
    }
  }
  // default case
  return oldArrowState;
};
