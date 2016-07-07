import Annotation from '../models/Annotation';
import { LOAD_ANNOTATIONS, UPDATE_ANNOTATION, DELETE_ANNOTATION, 
         CREATE_ANNOTATION, MOVE_ANNOTATION, TOGGLE_ANNOTATIONS,
         SHOW_ANNOTATION, SWAP_NODE_HIGHLIGHT, SWAP_EDGE_HIGHLIGHT, 
         SWAP_CAPTION_HIGHLIGHT, DELETE_ALL } from '../actions';
import merge from 'lodash/object/merge';
import range from 'lodash/utility/range';
import assign from 'lodash/object/assign'; 
import keys from 'lodash/object/keys';
import cloneDeep from 'lodash/lang/cloneDeep';
import isNumber from 'lodash/lang/isNumber';

const initState = { list: [], visible: true, currentIndex: 0 };

export default function annotations(state = initState, action) {
  switch (action.type) {

  case LOAD_ANNOTATIONS:
    return merge({}, state, { list: action.annotations.map(a => Annotation.setDefaults(a)) });

  case SHOW_ANNOTATION:
    return isNumber(action.id) && action.id !== state.currntIndex ? 
      assign({}, state, { currentIndex: action.id }) : state;

  case UPDATE_ANNOTATION:
    return merge({}, state, { list: [
      ...state.list.slice(0, action.id),
      assign({}, state.list[action.id], action.data),
      ...state.list.slice(action.id + 1)
    ] });

  case DELETE_ANNOTATION:
    return assign({}, state, { 
      currentIndex: Math.max(0, state.currentIndex - 1),
      list: [
        ...state.list.slice(0, action.id),
        ...state.list.slice(action.id + 1)
      ] 
    });

  case CREATE_ANNOTATION:
    return merge({}, state, { 
      list: [...state.list, Annotation.defaults()],
      currentIndex: typeof action.newIndex !== "undefined" ? action.newIndex  : state.currentIndex
    });

  case MOVE_ANNOTATION:
    let { fromIndex, toIndex } = action;

    let annotations = cloneDeep(state.list);
    annotations.splice(toIndex, 0, annotations.splice(fromIndex, 1)[0]);

    let indexes = range(Math.max(fromIndex, toIndex, state.currentIndex) + 1);
    indexes.splice(toIndex, 0, indexes.splice(fromIndex, 1)[0]);

    return assign({}, state, { 
      list: annotations,
      currentIndex: indexes.indexOf(state.currentIndex)
    });

  case TOGGLE_ANNOTATIONS:
    let visible = !state.visible;
    return merge({}, state, { visible });

  case SWAP_NODE_HIGHLIGHT:
    let nodeId = String(action.nodeId);
    let annotation = state.list[state.currentIndex];
    let nodeIds = annotation.nodeIds;
    let index = nodeIds.indexOf(nodeId);
    
    if (index == -1) {
      nodeIds = nodeIds.concat([nodeId]);
    } else {
      nodeIds.splice(index, 1);
    }

    return assign({}, state, { list: [
      ...state.list.slice(0, state.currentIndex),
      assign({}, annotation, { nodeIds }),
      ...state.list.slice(state.currentIndex + 1)
    ] });

  case SWAP_EDGE_HIGHLIGHT:
    let edgeId = String(action.edgeId);
    annotation = state.list[state.currentIndex];
    let edgeIds = annotation.edgeIds;
    index = edgeIds.indexOf(edgeId);
    
    if (index == -1) {
      edgeIds = edgeIds.concat([edgeId]);
    } else {
      edgeIds.splice(index, 1);
    }

    return assign({}, state, { list: [
      ...state.list.slice(0, state.currentIndex),
      assign({}, annotation, { edgeIds }),
      ...state.list.slice(state.currentIndex + 1)
    ] });

  case SWAP_CAPTION_HIGHLIGHT:
    let captionId = String(action.captionId);
    annotation = state.list[state.currentIndex];
    let captionIds = annotation.captionIds;
    index = captionIds.indexOf(captionId);
    
    if (index == -1) {
      captionIds = captionIds.concat([captionId]);
    } else {
      captionIds.splice(index, 1);
    }

    return assign({}, state, { list: [
      ...state.list.slice(0, state.currentIndex),
      assign({}, annotation, { captionIds }),
      ...state.list.slice(state.currentIndex + 1)
    ] });

  case DELETE_ALL:
    return assign({}, state, { list: [] });

  default:
    return state;
  }
};
