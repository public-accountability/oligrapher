import { SHOW_GRAPH, LOAD_GRAPH } from '../actions';
import { merge } from 'lodash';

export default function position(state = { currentId: null }, action) {
  switch (action.type) {

  case LOAD_GRAPH:
    return merge({}, state, { loadedId: action.id });

  case SHOW_GRAPH:
    return merge({}, state, { currentId: action.id });

  default:
    return state;
  }
};