import { SHOW_GRAPH, LOAD_GRAPH, NEW_GRAPH,
         LOAD_ANNOTATIONS, SHOW_ANNOTATION, DELETE_ANNOTATION, 
         MOVE_ANNOTATION, CREATE_ANNOTATION } from '../actions';
import merge from 'lodash/object/merge';
import range from 'lodash/utility/range';
import isNumber from 'lodash/lang/isNumber';

const initState = { 
  currentId: null, 
  currentIndex: 0 
};

export default function position(state = initState, action) {
  switch (action.type) {

  case NEW_GRAPH:
    return merge({}, state, { currentId: action.graph.id });

  case LOAD_GRAPH:
    return merge({}, state, { loadedId: action.id });

  case SHOW_GRAPH:
    return merge({}, state, { currentId: action.id });

  // annotations

  case SHOW_ANNOTATION:
    return isNumber(action.id) && action.id !== state.currntIndex ? 
      merge({}, state, { currentIndex: action.id }) : state;

  case DELETE_ANNOTATION:
    return merge({}, state, { currentIndex: Math.max(0, state.currentIndex - 1) });

  case MOVE_ANNOTATION:
    let { fromIndex, toIndex } = action;
    let indexes = range(Math.max(fromIndex, toIndex, state.currentIndex) + 1);
    indexes.splice(toIndex, 0, indexes.splice(fromIndex, 1)[0]);
    return merge({}, state, { currentIndex: indexes.indexOf(state.currentIndex) });

  case CREATE_ANNOTATION:
    return typeof action.newIndex !== "undefined" ? merge({}, state, { currentIndex: action.newIndex }) : state;

  default:
    return state;
  }
};