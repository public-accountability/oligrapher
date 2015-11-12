import { SWAP_NODE_SELECTION, SWAP_EDGE_SELECTION, SWAP_CAPTION_SELECTION, DELETE_SELECTION,
         SHOW_GRAPH } from '../actions';
import { merge, assign } from 'lodash';

const initState = { nodeIds: [], edgeIds: [], captionIds: [] };

function swapElement(ary, elem, singleSelect = true) {
  let newAry = merge([], ary);
  let index = newAry.indexOf(elem);
  
  if (index === -1) {
    newAry = singleSelect ? [elem] : newAry.concat(elem);
  } else {
    newAry.splice(index, 1);
  } 

  return newAry;
}

export default function selection(state = initState, action) {
  let newState, nodeIds, edgeIds, captionIds;

  switch (action.type) {

  // clear selection if graph is shown or selection deleted
  case DELETE_SELECTION:
  case SHOW_GRAPH:
    return initState;

  case SWAP_NODE_SELECTION:
    nodeIds = swapElement(state.nodeIds, action.nodeId, action.singleSelect);
    return action.singleSelect ? merge({}, initState, { nodeIds }) : assign({}, state, { nodeIds });

  case SWAP_EDGE_SELECTION:
    edgeIds = swapElement(state.edgeIds, action.edgeId, action.singleSelect);
    return action.singleSelect ? merge({}, initState, { edgeIds }) : assign({}, state, { edgeIds });

  case SWAP_CAPTION_SELECTION:
    captionIds = swapElement(state.captionIds, action.captionId, action.singleSelect);
    return action.singleSelect ? merge({}, initState, { captionIds }) : assign({}, state, { captionIds });

  default:
    return state;
  }
};