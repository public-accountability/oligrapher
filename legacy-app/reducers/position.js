import { SHOW_GRAPH, LOAD_GRAPH, NEW_GRAPH } from '../actions';
import merge from 'lodash/merge';

const initState = { 
  currentId: null
};

export default function position(state = initState, action) {
  switch (action.type) {

  case NEW_GRAPH:
    return merge({}, state, { currentId: action.graph.id });

  case LOAD_GRAPH:
    return merge({}, state, { loadedId: action.id });

  case SHOW_GRAPH:
    return merge({}, state, { currentId: action.id });

  default:
    return state;
  }
};
